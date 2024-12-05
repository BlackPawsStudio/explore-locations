import { Prisma, RegionType } from "@prisma/client";
import { Parser, type PrismaTransactionClient } from "../baseParsers/Parser";
import {
  AirportsCsvParser,
  type AirportsCsvProperties,
} from "./AirportsCsvParser";
import {
  AirportsGeoJsonParser,
  type AirportsGeoJsonProperties,
} from "./AirportsGeoJsonParser";

const CLOSE_CITY_THESHOLD_DISTANCE_METERS = 10000;

export class AirportsParser extends Parser {
  csvParser: AirportsCsvParser;
  geoJsonParser: AirportsGeoJsonParser;
  csvCache: { [key: number]: AirportsCsvProperties } = {};
  geoJsonCache: {
    [key: number]: { props: AirportsGeoJsonProperties; geoJson: string };
  } = {};

  constructor() {
    super();
    this.csvParser = new AirportsCsvParser((element, transactionClient) =>
      this.handleCsv(element, transactionClient)
    );
    this.geoJsonParser = new AirportsGeoJsonParser(
      (properties, geoJson, transactionClient) =>
        this.handleGeoJson(properties, geoJson, transactionClient)
    );
  }

  async parse(transactionClient: PrismaTransactionClient): Promise<void> {
    await transactionClient.$executeRaw`TRUNCATE TABLE "Airports" CASCADE`;

    await Promise.all([
      this.csvParser.parse(transactionClient),
      this.geoJsonParser.parse(transactionClient),
    ]).then(() => {
      return;
    });

    if (Object.keys(this.csvCache).length !== 0) {
      console.log(JSON.stringify(Object.keys(this.csvCache)));
      throw Error("Have leftover csv values");
    }

    if (Object.keys(this.geoJsonCache).length !== 0) {
      console.log(JSON.stringify(Object.keys(this.geoJsonCache)));
      throw Error("Have leftover geojson values");
    }
  }

  async handleCsv(
    element: AirportsCsvProperties,
    transactionClient: PrismaTransactionClient
  ): Promise<void> {
    const id = parseInt(element["ID,N,5,0"]);
    const geoJsonData = this.geoJsonCache[id];

    if (geoJsonData !== undefined) {
      delete this.geoJsonCache[id];
      await this.saveAirport(
        element,
        geoJsonData.props,
        geoJsonData.geoJson,
        transactionClient
      );
    } else {
      this.csvCache[id] = element;
    }
  }

  async handleGeoJson(
    properties: AirportsGeoJsonProperties,
    geoJson: string,
    transactionClient: PrismaTransactionClient
  ): Promise<void> {
    const id = properties.ID;
    const csvData = this.csvCache[id];

    if (csvData !== undefined) {
      delete this.csvCache[id];
      await this.saveAirport(csvData, properties, geoJson, transactionClient);
    } else {
      this.geoJsonCache[id] = { props: properties, geoJson };
    }
  }

  async saveAirport(
    csvElement: AirportsCsvProperties,
    geoJsonProperties: AirportsGeoJsonProperties,
    geoJson: string,
    transactionClient: PrismaTransactionClient
  ): Promise<void> {
    const xNumber = parseFloat(geoJsonProperties.X_CENTROID);
    const yNumber = parseFloat(geoJsonProperties.Y_CENTROID);

    const regionId = await this.findRegionId(
      transactionClient,
      geoJsonProperties.ID,
      xNumber,
      yNumber
    );

    await transactionClient.$executeRaw`INSERT INTO "Airports"
      ("id", "Geometry", "Center", "Name", "IntroEn", "SeoTitleEn", "SeoDescriptionEn", "Type", "AltName", "IATA", "ICAO", "Passengers", "NameDe", "NameEn", "NameEs", "NameFr", "NameIT", "NameNL", "Operator", "City", "Country", "ElFeet", "ElMeters", "Website", "Wiki", "TimezoneS", "TimezoneD", "RegionId")
      VALUES
      (${geoJsonProperties.ID},
        ST_SetSRID(
          ST_GeomFromGeoJSON(${geoJson}),
          4326
        ),
        ST_SetSRID(ST_MakePoint(${xNumber}, ${yNumber}), 4326),
        ${geoJsonProperties.NAME},
        ${csvElement.intro_en},
        ${csvElement.seo_title_en},
        ${csvElement.seo_description_en},
        ${geoJsonProperties.TYPE}::"TypeOfAirport",
        ${geoJsonProperties.ALT_NAME},
        ${geoJsonProperties.IATA},
        ${geoJsonProperties.ICAO},
        ${geoJsonProperties.PASSENGERS},
        ${geoJsonProperties.NAME_DE},
        ${csvElement.name_en},
        ${geoJsonProperties.NAME_ES},
        ${geoJsonProperties.NAME_FR},
        ${geoJsonProperties.NAME_IT},
        ${geoJsonProperties.NAME_NL},
        ${geoJsonProperties.OPERATOR},
        ${geoJsonProperties.CITY},
        ${geoJsonProperties.COUNTRY},
        ${geoJsonProperties.EL_FEET},
        ${geoJsonProperties.EL_METERS},
        ${geoJsonProperties.WEBSITE},
        ${geoJsonProperties.WIKI},
        ${geoJsonProperties.TIMEZONE_S},
        ${geoJsonProperties.TIMEZONE_D},
        ${regionId}
      )`;
  }

  async findRegionId(
    transactionClient: PrismaTransactionClient,
    id: number,
    x: number,
    y: number
  ): Promise<number> {
    const center = Prisma.sql`ST_SetSRID(ST_MakePoint(${x}, ${y}), 4326)`;

    const proiritizedRegionTypes: RegionType[] = [
      "municipality",
      "district",
      "admin_region",
      "country",
    ];
    let parentRegionId: number | undefined = undefined;
    for (const regionType of proiritizedRegionTypes) {
      const result = await transactionClient.$queryRaw<QueryResult[]>`
        SELECT id, ${center} <-> "Geometry" as dst
        FROM "Regions"
        WHERE "Type" = ${regionType}::"RegionType" AND ST_DWithin(${center}, "Geometry", 0)
        LIMIT 1
      `;
      parentRegionId = result[0]?.id;
      if (parentRegionId !== undefined) {
        break;
      }
    }
    if (parentRegionId === undefined) {
      return this.findAirportRegionWithoutParentRegion(
        transactionClient,
        center
      );
    }

    const biggestCloseCityInSameRegion =
      await this.findBiggestCloseCityRegionIdInRegion(
        transactionClient,
        parentRegionId,
        center
      );

    if (biggestCloseCityInSameRegion === undefined) {
      return parentRegionId;
    } else {
      return biggestCloseCityInSameRegion;
    }
  }

  async findAirportRegionWithoutParentRegion(
    transactionClient: PrismaTransactionClient,
    center: Prisma.Sql
  ): Promise<number> {
    const biggestCloseCityRegion = await this.findBiggestCloseCityInArea(
      transactionClient,
      center
    );
    if (biggestCloseCityRegion !== undefined) {
      return biggestCloseCityRegion.id;
    }

    return (await this.findClosestCityToPoint(transactionClient, center)).id;
  }

  async findBiggestCloseCityInArea(
    transactionClient: PrismaTransactionClient,
    center: Prisma.Sql
  ): Promise<QueryResult | undefined> {
    const biggestClosesCityResult = await transactionClient.$queryRaw<
      QueryResult[]
    >`
      SELECT "Regions".id as id
      FROM "Regions"
      LEFT JOIN "Cities"
      ON "Regions"."IdOriginal" = "Cities".id
      WHERE "Regions"."Type" = ${RegionType.city}::"RegionType" AND ST_DWithin(${center}, "Regions"."Center", ${CLOSE_CITY_THESHOLD_DISTANCE_METERS})
      ORDER BY "Cities"."Population" DESC
      LIMIT 1
    `;
    return biggestClosesCityResult[0];
  }

  async findClosestCityToPoint(
    transactionClient: PrismaTransactionClient,
    center: Prisma.Sql
  ): Promise<QueryResult> {
    const closestCityResult = await transactionClient.$queryRaw<QueryResult[]>`
      SELECT id, "IdParent"
      FROM "Regions"
      WHERE "Type" = ${RegionType.city}::"RegionType"
      ORDER BY ${center} <-> "Regions"."Center"
      LIMIT 1
    `;

    const closestCityRegion = closestCityResult[0];
    if (closestCityRegion === undefined) {
      throw new Error("we wave to have at least one city in Regions");
    }
    return closestCityRegion;
  }

  async findBiggestCloseCityRegionIdInRegion(
    transactionClient: PrismaTransactionClient,
    parentRegionId: number,
    center: Prisma.Sql
  ): Promise<number | undefined> {
    const closestCity = await this.findClosestCityToPoint(
      transactionClient,
      center
    );

    if (closestCity.IdParent !== parentRegionId) {
      return undefined;
    }

    const biggestCloseCity = await this.findBiggestCloseCityInArea(
      transactionClient,
      center
    );
    if (biggestCloseCity !== undefined) {
      return biggestCloseCity.id;
    } else {
      return undefined;
    }
  }
}

interface QueryResult {
  id: number;
  IdParent: number;
}
