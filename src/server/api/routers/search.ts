import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/src/server/api/trpc";
import { searchDefaultReturn } from "~/src/utils/searchDefaultReturn";
import { getAirports } from "~/src/utils/sqlQueries/airports";
import { getDrivingRouteData } from "~/src/utils/sqlQueries/drivingRoutes";
import { getFlightRouteData } from "~/src/utils/sqlQueries/flightRoutes";
import { searchRegions } from "~/src/utils/sqlQueries/regions";

export const searchRouter = createTRPCRouter({
  searchAll: publicProcedure
    .input(z.object({ searchString: z.string(), type: z.string() }))
    .query<{ name: string; id: number; type: string }[]>(async ({ input }) => {
      if (!input) {
        return [];
      }
      if (input.searchString) {
        switch (input.type) {
          case "all":
            const foundAirports = await getAirports(
              `WHERE "NameEn" ILIKE '%${input.searchString}%' OR "IATA" ILIKE '${input.searchString}%' ORDER BY "Passengers" LIMIT 1`
            );
            const foundGuides = await searchRegions(
              input.searchString,
              1
            );
            const foundFlyingRoutes = await getFlightRouteData(
              `WHERE "OriginCityName" ILIKE '%${input.searchString}%' OR "DestinationCityName" ILIKE '%${input.searchString}%' LIMIT 2`
            );
            const foundDrivingRoutes = await getDrivingRouteData(
              `WHERE "RegionFromCityName" ILIKE '%${input.searchString}%' OR "RegionToCityName" ILIKE '%${input.searchString}%' LIMIT 2`
            );
            return [
              foundGuides.map((el) => ({
                name: el.Name,
                id: el.id,
                type: "airports",
              })),
              foundFlyingRoutes.map((el) => ({
                name: `${el.OriginCityName} - ${el.DestinationCityName}`,
                id: el.id,
                type: "flying-route",
              })),
              foundDrivingRoutes.map((el) => ({
                name: `${el.RegionFromCityName} - ${el.RegionToCityName}`,
                id: el.id,
                type: "driving-route",
              })),
              foundAirports.map((el) => ({
                name: el.NameEn,
                id: el.id,
                type: "airport",
              })),
            ].flat();
          case "airport":
            const airports = await getAirports(
              `WHERE "NameEn" ILIKE '%${input.searchString}%' ORDER BY "Passengers" LIMIT 6`
            );
            return airports.map((el) => ({
              name: el.NameEn,
              id: el.id,
              type: "airport",
            }));
          case "airports":
            const guides = await searchRegions(
              input.searchString,
              6
            );
            return guides.map((el) => ({
              name: el.Name,
              id: el.id,
              type: "airports",
            }));
          case "flying-route":
            const flyingRoutes = await getFlightRouteData(
              `WHERE "OriginCityName" ILIKE '%${input.searchString}%' OR "DestinationCityName" ILIKE '%${input.searchString}%' LIMIT 6`
            );
            return flyingRoutes.map((el) => ({
              name: `${el.OriginCityName} - ${el.DestinationCityName}`,
              id: el.id,
              type: "flying-route",
            }));
          case "driving-route":
            const drivingRoutes = await getDrivingRouteData(
              `WHERE "RegionFromCityName" ILIKE '%${input.searchString}%' OR "RegionToCityName" ILIKE '%${input.searchString}%' LIMIT 6`
            );
            return drivingRoutes.map((el) => ({
              name: `${el.RegionFromCityName} - ${el.RegionToCityName}`,
              id: el.id,
              type: "driving-route",
            }));
          default:
            return [];
        }
      } else {
        return searchDefaultReturn(input.type);
      }
    }),
});
