import { type PrismaClient, RegionStatus } from "@prisma/client";

export async function getFlyingRoutesCount(
  prisma: PrismaClient
): Promise<number> {
  return await prisma.flyingRoutes.count({
    where: {
      OriginAirport: {
        Region: {
          Status: RegionStatus.Published,
        },
      },
      DestinationAirport: {
        Region: {
          Status: RegionStatus.Published,
        },
      },
    },
  });
}

export async function getFlyingRoutesIds(
  prisma: PrismaClient,
  page: number,
  itemsPerPage: number
): Promise<
  { id: number; OriginCityName: string; DestinationCityName: string }[]
> {
  return await prisma.flyingRoutes.findMany({
    where: {
      OriginAirport: {
        Region: {
          Status: RegionStatus.Published,
        },
      },
      DestinationAirport: {
        Region: {
          Status: RegionStatus.Published,
        },
      },
    },
    select: {
      id: true,
      OriginCityName: true,
      DestinationCityName: true,
    },
    skip: page * itemsPerPage,
    take: itemsPerPage,
  });
}
