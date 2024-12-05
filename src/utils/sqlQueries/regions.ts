import { prisma } from "~/src/server/db";
import type { AirportItem, AirportsCountType, RegionType } from "../types";

export const getRegions = async (param?: string) =>
  await prisma.$queryRawUnsafe<[RegionType]>(
    `SELECT "id", "Name", "Type", "IdParent", ST_AsGeoJSON("Geometry")::json as "Geometry" FROM "Regions" ${
      param || ""
    }`
    // `SELECT "id", "Code", "Country", "CountryI2", "Name", "TypeLocal", "TypeEn", "Type", "Points", "Points2" FROM "AdminRegions" ${
    //   param || ""
    // }`
  );

export const getChildRegions = async (id: string) =>
  await prisma.$queryRawUnsafe<[RegionType]>(
    `SELECT cr.id, cr."IdParent", cr."Name", cr."Type", cl."closeAirportsCount"
      FROM "Regions" cr
      INNER JOIN "Regions" r ON cr."IdParent" = r."id" AND r."id" = ${id} 
      INNER JOIN "CloseAirportsToRegions" cl ON r."id" = cl."id"
    `
  );

export const getRegionTree = async (id: string) =>
  await prisma.$queryRawUnsafe<[RegionType]>(
    `WITH RECURSIVE child_region AS (
      SELECT id, "IdParent", "Name", "Type"
      FROM "Regions"
      WHERE id = ${id}

    UNION ALL
      SELECT r.id, r."IdParent", r."Name", r."Type"
      FROM "Regions" r
      INNER JOIN child_region as cr ON r."id" = cr."IdParent"
    )

    SELECT id, "IdParent", "Name", "Type"
    FROM child_region;`
  );

export const getAirportsInRegion = async (param: string) =>
  await prisma.$queryRawUnsafe<
    AirportItem[]
  >(`SELECT ST_X(a."Center"::geometry) as "CenterX", ST_Y(a."Center"::geometry) as "CenterY", a."Passengers", a."id", a."Name", a."NameEn", a."Type", a."IATA", a."ICAO", a."City", a."Country", a."IntroEn", a."SeoTitleEn", a."SeoDescriptionEn", ST_DISTANCE(a."Center", r."Center") as "Distance"
    FROM "Airports" a
    INNER JOIN "Regions" r
    ${param}`);

export const getAirportsInRegionCount = async (id: string, type: string) =>
  await prisma.$queryRawUnsafe<[{ count: bigint }]>(
    `SELECT COUNT(*) FROM "Airports" a
    INNER JOIN "Regions" r ON ST_Intersects(a."Center", r."Geometry") AND a."Type" = '${type}' AND r."id" = '${
      id || ""
    }'`
  );

export const getAirportsCountData = async (
  id: string
): Promise<AirportsCountType> => {
  const internationalAirports = Number(
    (await getAirportsInRegionCount(id, "international"))[0].count
  );
  const domesticAirports = Number(
    (await getAirportsInRegionCount(id, "domestic"))[0].count
  );
  const localAirports = Number(
    (await getAirportsInRegionCount(id, "local"))[0].count
  );

  return {
    international: internationalAirports,
    domestic: domesticAirports,
    local: localAirports,
    all: internationalAirports + domesticAirports + localAirports,
  };
};

export const getAirportsAroundRegion = async (
  id: string
): Promise<AirportItem[]> => {
  const airportsInRegion =
    await getAirportsInRegion(`ON ST_Intersects(a."Center", r."Geometry") AND r."id" = '${
      id || ""
    }'
    ORDER BY COALESCE(CAST(a."Passengers" AS INTEGER), 0) DESC LIMIT 20`);
  const internationalAirports = await prisma.$queryRawUnsafe<AirportItem[]>(`
      SELECT ST_X(a."Center"::geometry) as "CenterX", ST_Y(a."Center"::geometry) as "CenterY", a."Passengers", a."id", a."Name", a."NameEn", a."Type", a."IATA", a."ICAO", a."City", a."Country", a."IntroEn", a."SeoTitleEn", a."SeoDescriptionEn"
      FROM "Airports" a 
      INNER JOIN "Regions" r 
      ON r."id" = '${id}' AND a."Type" = 'international' AND 
      ST_DWithin(a."Center"::geometry, COALESCE(r."Geometry", r."Center"), 200000) 
      ORDER BY COALESCE(CAST(a."Passengers" AS INTEGER), 0) DESC LIMIT 5
    `);
  const domesticAirports = await prisma.$queryRawUnsafe<AirportItem[]>(`
      SELECT ST_X(a."Center"::geometry) as "CenterX", ST_Y(a."Center"::geometry) as "CenterY", a."Passengers", a."id", a."Name", a."NameEn", a."Type", a."IATA", a."ICAO", a."City", a."Country", a."IntroEn", a."SeoTitleEn", a."SeoDescriptionEn"
      FROM "Airports" a 
      INNER JOIN "Regions" r 
      ON r."id" = '${id}' AND a."Type" = 'domestic' AND 
      ST_DWithin(a."Center"::geometry, COALESCE(r."Geometry", r."Center"), 200000)
      ORDER BY a."Center" <-> r."Center" DESC LIMIT 5
    `);
  return internationalAirports
    .concat(domesticAirports)
    .filter((el) => !airportsInRegion.find((elIn) => elIn.id === el.id));
};

export const getSameLevelRegions = async (
  type: string,
  parentId: number
): Promise<RegionType[]> =>
  await prisma.$queryRawUnsafe<[RegionType]>(
    `SELECT r."id", r."Name", r."Type", r."IdParent", cl."closeAirportsCount" 
    FROM "Regions" r INNER JOIN "CloseAirportsToRegions" cl 
    ON "Type" = '${type}' AND r."id" = cl."id"${
      parentId ? ` AND "IdParent" = '${parentId}'` : ""
    }`
  );

export const getIso2Code = async (name: string): Promise<string | null> =>
  (
    await prisma.$queryRawUnsafe<[{ Code: string }]>(
      `SELECT "Code" FROM "Countries" WHERE "Name" = '${name}'`
    )
  )[0]?.Code;

export const searchRegions = async (name: string, limit: number) =>
  await prisma.$queryRawUnsafe<[RegionType]>(
    `SELECT r."id", r."Name", r."Type", r."IdParent", ST_AsGeoJSON(r."Geometry")::json as "Geometry" 
    FROM "Regions" r INNER JOIN "Cities" c 
    ON (r."Type" = 'city' AND r."Name" ILIKE '${name}%' AND r."IdOriginal" = c."id") OR (r."Name" ILIKE '${name}%') 
    ORDER BY
    CASE WHEN r."Type" = 'city' THEN (
    c."Population"
    ) END DESC LIMIT ${limit}`
  );
