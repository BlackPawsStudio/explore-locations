import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/src/server/api/trpc";
import {
  getChildRegions,
  getSameLevelRegions,
} from "~/src/utils/sqlQueries/regions";

export const guidesPageClient = createTRPCRouter({
  getSameLevelRegions: publicProcedure
    .input(
      z.object({
        type: z.string(),
        idParent: z.number(),
      })
    )
    .query(
      async ({ input }) => await getSameLevelRegions(input.type, input.idParent)
    ),

  getChildRegions: publicProcedure
    .input(z.string())
    .query(async ({ input }) => await getChildRegions(input)),
});
