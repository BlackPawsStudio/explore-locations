import { type PrismaClient, RegionStatus } from "@prisma/client";

export async function getAirportsCount(prisma: PrismaClient): Promise<number> {
  return await prisma.airports.count({
    where: {
      Region: {
        Status: RegionStatus.Published,
      },
    },
  });
}

export async function getAirportsIds(
  prisma: PrismaClient,
  page: number,
  itemsPerPage: number
): Promise<{ id: number; NameEn: string }[]> {
  return await prisma.airports.findMany({
    where: {
      Region: {
        Status: RegionStatus.Published,
      },
    },
    select: {
      id: true,
      NameEn: true,
    },
    skip: page * itemsPerPage,
    take: itemsPerPage,
  });
}
