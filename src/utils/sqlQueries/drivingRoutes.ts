import { prisma } from "~/src/server/db";
import type { DrivingDistanceType } from "../types";

export const getDrivingRouteData = async (param: string) =>
  await prisma.$queryRawUnsafe<[DrivingDistanceType]>(
    `SELECT 
    "id",
    "DistanceKm", 
    "DistanceMiles",
    "FlightDistance",
    "FlightDistanceMiles",
    "DrivingTime", 
    "RegionFromCityName",
    "RegionToCityName",
    "CountryFromName",
    "CountryToName",
    "RegionFromCityId",
    "RegionToCityId",
    "RegionFromId",
    "RegionToId",
    ST_X("RegionFromCoordinates"::geometry) as "OriginCenterX", 
    ST_Y("RegionFromCoordinates"::geometry) as "OriginCenterY", 
    ST_X("RegionToCoordinates"::geometry) as "DestinationCenterX", 
    ST_Y("RegionToCoordinates"::geometry) as "DestinationCenterY"
    FROM "DrivingRoutes" ${param}`
  );

export const getDrivingRoute = async (id: string) =>
  await getDrivingRouteData(`WHERE "id" = '${id}'`);

export const getDrivingDistances = async (country: string, id: number) =>
  await getDrivingRouteData(
    `WHERE LOWER("RegionFromCityName") = '${country.toLowerCase()}' AND "id" != '${id}' LIMIT 20`
  );

export const getRegionTimezone = async (id: number) =>
  await prisma.$queryRawUnsafe<[{ TimezoneD: string }]>(`
    SELECT a."TimezoneD" FROM "Airports" a INNER JOIN "Regions" r 
    ON r."id" = '${id}' AND ST_DWithin(a."Center"::geometry, COALESCE(r."Geometry", r."Center"), 200000) AND a."TimezoneD" IS NOT NULL LIMIT 1
  `);

export const getDrivingRouteURL = (
  id: number,
  fromCityName: string,
  toCityName: string
) => {
  return `/driving-route/${id}/${fromCityName
    .replaceAll(" ", "_")
    .toLowerCase()}/${encodeURIComponent(
    toCityName.replaceAll(" ", "_").toLowerCase()
  )}`;
};
