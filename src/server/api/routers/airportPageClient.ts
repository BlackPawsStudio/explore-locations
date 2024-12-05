import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/src/server/api/trpc";
import { getAirportsAround } from "~/src/utils/sqlQueries/airports";
import { getChildRegions } from "~/src/utils/sqlQueries/regions";

export const airportPageClient = createTRPCRouter({
  getAirportsAround: publicProcedure
    .input(
      z.object({
        CenterX: z.number(),
        CenterY: z.number(),
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
      const responseData = await getAirportsAround(
        input.CenterX,
        input.CenterY,
        input.id
      );
      responseData.forEach((el) => {
        el.Distance = Math.round(
          Math.sqrt(
            Math.pow(input.CenterX - el.CenterX, 2) +
              Math.pow(input.CenterY - el.CenterY, 2)
          ) * 100
        );
      });
      responseData.sort((a, b) => (a.Distance || 0) - (b.Distance || 0));
      return responseData;
    }),

  getChildRegions: publicProcedure
    .input(z.number())
    .query(async ({ input }) => await getChildRegions(`${input}`)),
});
