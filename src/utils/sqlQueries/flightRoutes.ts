import { prisma } from "~/src/server/db";
import type { FlightDistanceType } from "../types";

export const getFlightRouteData = async (condition: string) =>
  await prisma.$queryRawUnsafe<[FlightDistanceType]>(
    `SELECT 
    "id",
    "LengthKm", 
    "LengthMiles",
    "FlightDuration",
    "DestinationAirportId",
    "OriginAirportId",
    "OriginCityName",
    "DestinationCityName"
     FROM "FlyingRoutes" ${condition}`
  );

export const getFlightRoute = async (id: string) =>
  await getFlightRouteData(`WHERE "id" = '${id}'`);

export const getFlyingDistances = async (country: string, id: number) =>
  await getFlightRouteData(
    `WHERE LOWER("OriginCityName") = '${country.toLowerCase()}' AND "id" != '${id}' LIMIT 20`
  );

export const getFlightRouteURL = (
  id: number,
  fromCityName: string,
  toCityName: string
) => {
  return `/flying-route/${id}/${fromCityName
    .replaceAll(" ", "_")
    .toLowerCase()}/${encodeURIComponent(
    toCityName.replaceAll(" ", "_").toLowerCase()
  )}`;
};
