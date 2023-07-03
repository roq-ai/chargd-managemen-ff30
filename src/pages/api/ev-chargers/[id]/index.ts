import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { evChargerValidationSchema } from 'validationSchema/ev-chargers';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.ev_charger
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getEvChargerById();
    case 'PUT':
      return updateEvChargerById();
    case 'DELETE':
      return deleteEvChargerById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getEvChargerById() {
    const data = await prisma.ev_charger.findFirst(convertQueryToPrismaUtil(req.query, 'ev_charger'));
    return res.status(200).json(data);
  }

  async function updateEvChargerById() {
    await evChargerValidationSchema.validate(req.body);
    const data = await prisma.ev_charger.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteEvChargerById() {
    const data = await prisma.ev_charger.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
