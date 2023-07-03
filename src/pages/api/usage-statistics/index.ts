import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { usageStatisticsValidationSchema } from 'validationSchema/usage-statistics';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getUsageStatistics();
    case 'POST':
      return createUsageStatistics();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getUsageStatistics() {
    const data = await prisma.usage_statistics
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'usage_statistics'));
    return res.status(200).json(data);
  }

  async function createUsageStatistics() {
    await usageStatisticsValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.usage_statistics.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
