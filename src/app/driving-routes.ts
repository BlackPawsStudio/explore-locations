import { type PrismaClient, RegionStatus } from "@prisma/client";

export async function getDrivingRoutesCount(
  prisma: PrismaClient
): Promise<number> {
  return await prisma.drivingRoutes.count({
    where: {
      RegionFrom: {
        Status: RegionStatus.Published,
      },
      RegionTo: {
        Status: RegionStatus.Published,
      },
    },
  });
}

export async function getDrivingRoutesIds(
  prisma: PrismaClient,
  page: number,
  itemsPerPage: number
): Promise<
  { id: number; RegionFromCityName: string; RegionToCityName: string }[]
> {
  return await prisma.drivingRoutes.findMany({
    where: {
      RegionFrom: {
        Status: RegionStatus.Published,
      },
      RegionTo: {
        Status: RegionStatus.Published,
      },
    },
    select: {
      id: true,
      RegionFromCityName: true,
      RegionToCityName: true,
    },
    skip: page * itemsPerPage,
    take: itemsPerPage,
  });
}
