import { Prisma } from "@prisma/client";
import { CsvParser } from "./baseParsers/CsvParser";
import { type PrismaTransactionClient } from "./baseParsers/Parser";
import { BatchSaver } from "./baseSavers/BatchSaver";
import { type Saver } from "./baseSavers/Saver";

export class DrivingRoutesParser extends CsvParser<DrivingRoutesCsvProperties> {
  saver: Saver = new BatchSaver(
    "DrivingRoutes",
    `
  "id",
  "TitleEn",
  "DistanceKm",
  "DistanceMiles",
  "DrivingTime",
  "FlightDistance",
  "FlightDistanceMiles",
  "RegionFromCoordinates",
  "RegionFromCoordinatesOriginal",
  "RegionToCoordinates",
  "RegionToCoordinatesOriginal",
  "RegionFromCityName",
  "RegionFromCityId",
  "CountryFromName",
  "CountryFromId",
  "RegionToCityName",
  "RegionToCityId",
  "CountryToName",
  "CountryToId",
  "MNI",
  "SeoDemandEn",
  "MetaTitleEn",
  "MetaDescriptionEn",
  "IntroEn",
  "ContentEn",
  "FaqQ1En",
  "FaqA1En",
  "FaqQ2En",
  "FaqA2En",
  "RegionFromId",
  "RegionToId"
  `,
    50
  );
  constructor() {
    super("driving_routes_database_1.csv", "driving_routes_database_2.csv");
  }

  async setupDatabase(
    transactionClient: PrismaTransactionClient
  ): Promise<void> {
    await transactionClient.$executeRaw`TRUNCATE TABLE "DrivingRoutes"`;
  }

  async saveElement(
    element: DrivingRoutesCsvProperties,
    transactionClient: PrismaTransactionClient
  ): Promise<void> {
    const regionFromCoordinates = this.сoordinatesToLonLat(
      element.region_from_coordinates
    );
    const regionToCoordinates = this.сoordinatesToLonLat(
      element.region_to_coordinates
    );

    const sqlFromPoint = Prisma.sql` ST_SetSRID(ST_MakePoint(
      ${parseFloat(regionFromCoordinates[1] || "")}, ${parseFloat(
      regionFromCoordinates[0] || ""
    )} ), 4326)`;
    const sqlToPoint = Prisma.sql` ST_SetSRID(ST_MakePoint(
      ${parseFloat(regionToCoordinates[1] || "")}, ${parseFloat(
      regionToCoordinates[0] || ""
    )}), 4326)`;

    await this.saver.onItemValues(
      transactionClient,
      Prisma.sql`
    ( ${parseInt(element.id)},
        ${element.title_en},
        ${parseInt(element.distance_km)},
        ${parseInt(element.distance_miles)},
        ${element.driving_time},
        ${parseInt(element.flight_distance)},
        ${parseInt(element.flight_distance_miles)},
        ${sqlFromPoint},
        ${element.region_from_coordinates_degrees},
        ${sqlToPoint},
        ${element.region_to_coordinates_degrees},
        ${element.region_from_city_name},
        ${element.region_from_city_id},
        ${element.country_from_name},
        ${element.country_from_id},
        ${element.region_to_city_name},
        ${element.region_to_city_id},
        ${element.country_to_name},
        ${element.country_to_id},
        ${element.mni === "true"},
        ${parseInt(element.seo_demand_en)},
        ${element.meta_title_en},
        ${element.meta_description_en},
        ${element.intro_en},
        ${element.content_en},
        ${element.faq_q1_en},
        ${element.faq_a1_en},
        ${element.faq_q2_en},
        ${element.faq_a2_en},
        (SELECT id
          FROM "Regions" 
          WHERE "Regions"."Type" = 'city'
          ORDER BY "Regions"."Center" <-> (${sqlFromPoint})
          LIMIT 1
        ),
        (SELECT id
          FROM "Regions" 
          WHERE "Regions"."Type" = 'city'
          ORDER BY "Regions"."Center" <-> (${sqlToPoint})
          LIMIT 1
        )
      )
    `
    );
  }

  async onFinish(transactionClient: PrismaTransactionClient): Promise<void> {
    await this.saver.finish(transactionClient);
    await super.onFinish(transactionClient);
  }

  сoordinatesToLonLat(pointStr: string): string[] {
    const result = pointStr.split(/[ ,]+/);
    return result;
  }
}

interface DrivingRoutesCsvProperties {
  id: string;
  title_en: string;
  distance_km: string;
  distance_miles: string;
  driving_time?: string;
  flight_distance: string;
  flight_distance_miles: string;
  region_from_coordinates: string;
  region_from_coordinates_degrees: string;
  region_to_coordinates: string;
  region_to_coordinates_degrees: string;
  region_from_city_name: string;
  region_from_city_id?: string;
  country_from_name: string;
  country_from_id?: string;
  region_to_city_name: string;
  region_to_city_id?: string;
  country_to_name: string;
  country_to_id?: string;
  mni: string;
  seo_demand_en: string;
  meta_title_en?: string;
  meta_description_en?: string;
  intro_en?: string;
  content_en?: string;
  faq_q1_en?: string;
  faq_a1_en?: string;
  faq_q2_en?: string;
  faq_a2_en?: string;
}
