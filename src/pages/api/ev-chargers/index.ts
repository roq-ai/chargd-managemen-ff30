import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { evChargerValidationSchema } from 'validationSchema/ev-chargers';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getEvChargers();
    case 'POST':
      return createEvCharger();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getEvChargers() {
    const data = await prisma.ev_charger
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'ev_charger'));
    return res.status(200).json(data);
  }

  async function createEvCharger() {
    await evChargerValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.usage_statistics?.length > 0) {
      const create_usage_statistics = body.usage_statistics;
      body.usage_statistics = {
        create: create_usage_statistics,
      };
    } else {
      delete body.usage_statistics;
    }
    const data = await prisma.ev_charger.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
