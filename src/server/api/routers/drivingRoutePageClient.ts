import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/src/server/api/trpc";
import {
  getDrivingDistances,
  getRegionTimezone,
} from "~/src/utils/sqlQueries/drivingRoutes";

export const drivingRoutePageClient = createTRPCRouter({
  getRelatedDistances: publicProcedure
    .input(
      z.object({
        nameOrigin: z.string(),
        nameDestination: z.string(),
        id: z.number(),
      })
    )
    .query(async ({ input }) => ({
      relatedOriginDistances: await getDrivingDistances(
        input.nameOrigin,
        input.id
      ),
      relatedDestinationDistances: await getDrivingDistances(
        input.nameDestination,
        input.id
      ),
    })),

  getTimezones: publicProcedure
    .input(z.number().optional())
    .query(async ({ input }) => input ? await getRegionTimezone(input) : null),
});
