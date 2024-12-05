import { AdminRegionParser } from "./parsing/AdminRegioinsParser";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { type Parser } from "./parsing/baseParsers/Parser";
import { DistrictsParser } from "./parsing/DistrictsParser";
import { MunicipalitiesParser } from "./parsing/MunicipalitiesParser";
import { CitiesParser } from "./parsing/CitiesParser";
import { CountriesParser } from "./parsing/CountriesParser";
import { DrivingRoutesParser } from "./parsing/DrivingRoutesParser";
import { AirportsParser } from "./parsing/airports/AirportsParser";
import { FlyingRoutesParser } from "./parsing/FlyingRoutesParser";
import { RegionsInitializer } from "./parsing/RegionsInitializer";
import { ContinentsParser } from "./parsing/ContinentsParser";
import { CloseAirportsToRegions } from "./parsing/CloseAirportsToRegions";

const parsers: Parser[] = [
  new ContinentsParser(),
  new CountriesParser(),
  new AdminRegionParser(),
  new DistrictsParser(),
  new MunicipalitiesParser(),
  new CitiesParser(),
  new DrivingRoutesParser(),
  new RegionsInitializer(),
  new AirportsParser(),
  new FlyingRoutesParser(),
  new CloseAirportsToRegions(),
];

export const refreshDatabaseRouter = createTRPCRouter({
  //TODO(replace with `protectedProcedure`)
  getAwsFile: publicProcedure.query(async ({ ctx }) => {
    await ctx.prisma.$transaction(
      async (transactionClient) => {
        for (const parser of parsers) {
          await parser.parse(transactionClient);
        }
      },
      { timeout: 600000000 }
    );
    return {};
  }),
});
