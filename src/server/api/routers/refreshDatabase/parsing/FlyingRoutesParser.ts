import { Prisma } from "@prisma/client";
import { CsvParser } from "./baseParsers/CsvParser";
import { type PrismaTransactionClient } from "./baseParsers/Parser";
import { BatchSaver } from "./baseSavers/BatchSaver";
import { type Saver } from "./baseSavers/Saver";

export class FlyingRoutesParser extends CsvParser<FlyingRoutesCsvProperties> {
  saver: Saver = new BatchSaver(
    "FlyingRoutes",
    `
        "id",
        "RouteIata",
        "Type",
        "LengthMiles",
        "LengthKm",
        "FlightDuration",
        "TimeDifference",
        "CO2Emissions",
        "IntroEn",
        "DetailsEn",
        "MetaDescriptionEn",
        "OriginAirportId",
        "OriginCoordinates",
        "OriginCityName",
        "DestinationAirportId",
        "DestinationCoordinates",
        "DestinationCityName",
        "Airlines"
    `,
    50
  );

  constructor() {
    super("flying_routes.csv");
  }

  async setupDatabase(
    transactionClient: PrismaTransactionClient
  ): Promise<void> {
    await transactionClient.$executeRaw`TRUNCATE TABLE "FlyingRoutes"`;
  }

  async saveElement(
    element: FlyingRoutesCsvProperties,
    transactionClient: PrismaTransactionClient
  ): Promise<void> {
    const originGpsCoordinates = this.dmsCoordinatesToLonLat(
      element.origin_gps_coordinates,
      element.id
    );
    const destinationGpsCoordinates = this.dmsCoordinatesToLonLat(
      element.destination_gps_coordinates,
      element.id
    );
    const airlines = this.getAirlines(element);

    await this.saver.onItemValues(
      transactionClient,
      Prisma.sql`
      ( ${parseInt(element.id)},
        ${element.route_iata},
        ${element.type}::"FlyingRouteType",
        ${parseInt(element.length_miles)},
        ${parseInt(element.length_km)},
        ${element.flight_duration},
        ${element.time_difference},
        ${element.co2_emissions},
        ${element.intro_en},
        ${element.details_en},
        ${element.meta_description_en},
        ( 
          SELECT id
          FROM   "Airports" 
          ORDER BY
                "Center" <-> ST_SetSRID(ST_MakePoint(
                  ${originGpsCoordinates[0]}, ${originGpsCoordinates[1]}
                ), 4326)
          LIMIT  1
        ),
        ST_SetSRID(ST_MakePoint(
          ${originGpsCoordinates[0]}, ${originGpsCoordinates[1]}
        ), 4326),
        ${element.origin_city_name},
        ( 
          SELECT id
          FROM   "Airports" 
          ORDER BY
                "Center" <-> ST_SetSRID(ST_MakePoint(
                  ${destinationGpsCoordinates[0]}, ${
        destinationGpsCoordinates[1]
      }
                ), 4326)
          LIMIT  1
        ),
        ST_SetSRID(ST_MakePoint(
          ${destinationGpsCoordinates[0]}, ${destinationGpsCoordinates[1]}
        ), 4326),
        ${element.destination_city_name},
        ${airlines}
        )
      `
    );
  }

  getAirlines(element: FlyingRoutesCsvProperties): string[] {
    const ans: string[] = [];
    const size = parseInt(element.nr_airlines ?? "0");
    for (let i = 0; i < size; i++) {
      const airlineName = `airline_${i + 1}`;
      const airline = element[airlineName as keyof typeof element];
      if (airline !== undefined) {
        ans.push(airline);
      }
    }
    const knownMismatchingAirlineIds: string[] = ["30658"];
    if (size !== ans.length) {
      if (!knownMismatchingAirlineIds.includes(element.id)) {
        throw new Error(
          `some airports are missing in id: ${element.id}. Contact source file maintainer about mismatch`
        );
      }
    } else {
      if (knownMismatchingAirlineIds.includes(element.id)) {
        throw new Error(
          `airline with id: ${element.id} is no longer broken, remove exception from code`
        );
      }
    }
    return ans;
  }

  async onFinish(transactionClient: PrismaTransactionClient): Promise<void> {
    await this.saver.finish(transactionClient);
    await super.onFinish(transactionClient);
  }

  //DMS - Degrees Minutes Seconds coordinates format
  //example: 31°32′50″N, 102°21′14″E
  dmsCoordinatesToLonLat(pointStr: string, id: string): number[] {
    const groups = pointStr.match(
      /(\d{1,3})°(\d{1,2})′(\d{1,2})″([NS]), (\d{1,3})°(\d{1,2})′(\d{1,2})″([EW])/
    );
    if (groups == null) {
      throw new Error(
        `origin_gps_coordinates is broken: ${pointStr} in id: ${id}`
      );
    }
    const latSign = groups[4] === "N" ? 1 : -1;
    const lonSign = groups[8] === "E" ? 1 : -1;

    const lat = this.toCoordinate(groups[1], groups[2], groups[3], latSign);
    const lon = this.toCoordinate(groups[5], groups[6], groups[7], lonSign);
    return [lon, lat];
  }

  toCoordinate(
    degrees: string | undefined,
    minuets: string | undefined,
    seconds: string | undefined,
    sign: number
  ): number {
    if (
      degrees === undefined ||
      minuets === undefined ||
      seconds === undefined
    ) {
      throw new Error("origin_gps_coordinates is broken in coords");
    }
    return (
      sign *
      (parseFloat(degrees) +
        parseFloat(minuets) / 60.0 +
        parseFloat(seconds) / 3600.0)
    );
  }
}

interface FlyingRoutesCsvProperties {
  id: string;
  route_iata: string;
  type: string;
  length_miles: string;
  length_km: string;
  flight_duration: string;
  time_difference: string;
  co2_emissions: string;
  intro_en?: string;
  details_en?: string;
  meta_description_en?: string;
  origin_airport_name: string;
  origin_airport_id?: string;
  origin_city_name: string;
  origin_gps_coordinates: string;
  origin_latitude: string;
  origin_longitude: string;
  destination_airport_name: string;
  destination_airport_id?: string;
  destination_city_name: string;
  destination_gps_coordinates: string;
  destination_latitude: string;
  destination_longitude: string;
  nr_airlines: string;
}
