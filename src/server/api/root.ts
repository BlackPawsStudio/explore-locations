import { refreshDatabaseRouter } from "./routers/refreshDatabase/refreshDatabase";
import { createTRPCRouter } from "~/src/server/api/trpc";
import { exampleRouter } from "~/src/server/api/routers/example";
import { airportRouter } from "./routers/airport";
import { searchRouter } from "./routers/search";
import { airportPageClient } from "./routers/airportPageClient";
import { drivingRoutePageClient } from "./routers/drivingRoutePageClient";
import { countryCodeRouter } from "./routers/countryCode";
import { flyingRoutePageClient } from "./routers/flyingRoutePageClient";
import { guidesPageClient } from "./routers/guidesPageClient";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  refreshDatabase: refreshDatabaseRouter,
  airport: airportRouter,
  search: searchRouter,
  airportPageClient: airportPageClient,
  drivingRoutePageClient: drivingRoutePageClient,
  flyingRoutePageClient: flyingRoutePageClient,
  countryCodeRouter: countryCodeRouter,
  guidesPageClient: guidesPageClient,
});

// export type definition of API
export type AppRouter = typeof appRouter;
