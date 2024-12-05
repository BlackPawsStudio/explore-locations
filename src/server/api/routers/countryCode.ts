import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/src/server/api/trpc";
import { getCountryCode } from "~/src/utils/getCountryCode";
import { getRegionTree } from "~/src/utils/sqlQueries/regions";

export const countryCodeRouter = createTRPCRouter({
  getCountryCodes: publicProcedure
    .input(
      z.object({
        fromId: z.number(),
        toId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const regionTreeFrom = (await getRegionTree(`${input.fromId}`)).reverse();
      const regionTreeTo = (await getRegionTree(`${input.toId}`)).reverse();
      return {
        countryFromCode: regionTreeFrom[1]
          ? getCountryCode(regionTreeFrom[1].id)
          : null,
        countryToCode: regionTreeTo[1]
          ? getCountryCode(regionTreeTo[1].id)
          : null,
      };
    }),
});
