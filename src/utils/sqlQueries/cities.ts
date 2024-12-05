import { prisma } from "~/src/server/db";
import type { CityType } from "../types";

export const getCities = async (param?: string) =>
  await prisma.$queryRawUnsafe<[CityType]>(
    `SELECT 
    c."id", ST_X(c."Geometry"::geometry) as "CenterX", ST_Y(c."Geometry"::geometry) as "CenterY", c."Name", c."Type", c."NameAlt", c."Country", c."ISO2", c."ISO3", c."ParentADM", c."Capital", c."Population"
    FROM "Cities" c INNER JOIN "Regions" r ${param || ""}`
  );
