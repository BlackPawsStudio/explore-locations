import { getDrivingRouteURL } from "./../../../../../../utils/sqlQueries/drivingRoutes";
import { getFlightRouteURL } from "./../../../../../../utils/sqlQueries/flightRoutes";
import { getAirportURL } from "./../../../../../../utils/sqlQueries/airports";
import { prisma } from "./../../../../../../server/db";
import { getServerSideSitemap } from "next-sitemap";
import { RouteType, getItemsPerPage, getSiteUrl } from "../../../../../utils";
import { getAirportsIds } from "../../../../../airports";
import { getFlyingRoutesIds } from "../../../../../flying-routes";
import { getDrivingRoutesIds } from "../../../../../driving-routes";

export async function GET(_: Request, context: { params }) {
  const type: RouteType = context.params.type || "";
  const pageNumber = context.params.page_number || "";

  let urls: string[];

  switch (type) {
    case "airports":
      urls = (await getAirportsIds(prisma, pageNumber, getItemsPerPage())).map(
        ({ id, NameEn }) => `${getSiteUrl()}${getAirportURL(id, NameEn)}`
      );
      break;
    case "flying_routes":
      urls = (
        await getFlyingRoutesIds(prisma, pageNumber, getItemsPerPage())
      ).map(
        ({ id, OriginCityName, DestinationCityName }) =>
          `${getSiteUrl()}${getFlightRouteURL(
            id,
            OriginCityName,
            DestinationCityName
          )}`
      );
      break;
    case "driving_routes":
      urls = (
        await getDrivingRoutesIds(prisma, pageNumber, getItemsPerPage())
      ).map(
        ({ id, RegionFromCityName, RegionToCityName }) =>
          `${getSiteUrl()}${getDrivingRouteURL(
            id,
            RegionFromCityName,
            RegionToCityName
          )}`
      );
      break;
  }

  return getServerSideSitemap(
    urls.map((url) => {
      return { loc: url, changefreq: "daily" };
    })
  );
}
