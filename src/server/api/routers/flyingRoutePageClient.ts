import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/src/server/api/trpc";
import { getAirportsAround } from "~/src/utils/sqlQueries/airports";
import { getFlyingDistances } from "~/src/utils/sqlQueries/flightRoutes";

export const flyingRoutePageClient = createTRPCRouter({
  getRelatedDistances: publicProcedure
    .input(
      z.object({
        OriginCityName: z.string(),
        DestinationCityName: z.string(),
        id: z.number(),
      })
    )
    .query(async ({ input }) => ({
      relatedOriginAirports: await getFlyingDistances(
        input.OriginCityName,
        input.id
      ),
      relatedDestinationAirports: await getFlyingDistances(
        input.DestinationCityName,
        input.id
      ),
    })),

  getAirportAround: publicProcedure
    .input(
      z.object({
        origin: z.object({
          CenterX: z.number(),
          CenterY: z.number(),
          id: z.number(),
        }),
        destination: z.object({
          CenterX: z.number(),
          CenterY: z.number(),
          id: z.number(),
        }),
      })
    )
    .query(async ({ input }) => {
      const airportsAroundOrigin = await getAirportsAround(
        input.origin.CenterX,
        input.origin.CenterY,
        input.origin.id,
        4
      );

      airportsAroundOrigin.forEach((el) => {
        el.Distance = Math.round(
          Math.sqrt(
            Math.pow(input.origin.CenterX - el.CenterX, 2) +
              Math.pow(input.origin.CenterY - el.CenterY, 2)
          ) * 100
        );
      });

      const airportsAroundDestination = await getAirportsAround(
        input.destination.CenterX,
        input.destination.CenterY,
        input.destination.id,
        4
      );

      airportsAroundDestination.forEach((el) => {
        el.Distance = Math.round(
          Math.sqrt(
            Math.pow(input.destination.CenterX - el.CenterX, 2) +
              Math.pow(input.destination.CenterY - el.CenterY, 2)
          ) * 100
        );
      });

      airportsAroundOrigin.sort((a, b) =>
        (a.Distance || 0) > (b.Distance || 0) ? 1 : -1
      );

      airportsAroundDestination.sort((a, b) =>
        (a.Distance || 0) > (b.Distance || 0) ? 1 : -1
      );

      return {
        airportsAroundOrigin,
        airportsAroundDestination,
      };
    }),
});
