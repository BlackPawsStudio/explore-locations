import { getServerSideSitemapIndex } from "next-sitemap";
import { type RouteType, getItemsPerPage, getSiteUrl } from "../utils";
import { prisma } from "~/src/server/db";
import { getAirportsCount } from "../airports";
import { getFlyingRoutesCount } from "../flying-routes";
import { getDrivingRoutesCount } from "../driving-routes";

export async function GET() {
  return getServerSideSitemapIndex(
    (
      await Promise.all([
        generateSitemaps("airports", getAirportsCount(prisma)),
        generateSitemaps("flying_routes", getFlyingRoutesCount(prisma)),
        generateSitemaps("driving_routes", getDrivingRoutesCount(prisma)),
      ])
    ).flatMap((list) => list)
  );
}

async function generateSitemaps(
  type: RouteType,
  itemsCount: Promise<number>
): Promise<string[]> {
  const pagesCount = Math.ceil((await itemsCount) / getItemsPerPage());

  const pages: string[] = [];
  for (let i = 0; i < pagesCount; i++) {
    pages.push(`${getSiteUrl()}/sitemap-${type}-${i}.xml`);
  }
  return pages;
}
