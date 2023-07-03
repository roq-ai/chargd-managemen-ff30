import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { usageStatisticsValidationSchema } from 'validationSchema/usage-statistics';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.usage_statistics
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getUsageStatisticsById();
    case 'PUT':
      return updateUsageStatisticsById();
    case 'DELETE':
      return deleteUsageStatisticsById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getUsageStatisticsById() {
    const data = await prisma.usage_statistics.findFirst(convertQueryToPrismaUtil(req.query, 'usage_statistics'));
    return res.status(200).json(data);
  }

  async function updateUsageStatisticsById() {
    await usageStatisticsValidationSchema.validate(req.body);
    const data = await prisma.usage_statistics.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteUsageStatisticsById() {
    const data = await prisma.usage_statistics.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
