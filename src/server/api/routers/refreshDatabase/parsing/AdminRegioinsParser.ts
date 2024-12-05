import { type PrismaTransactionClient } from "./baseParsers/Parser";
import { GeoJsonParser } from "./baseParsers/GeoJsonParser";
import { BatchSaver } from "./baseSavers/BatchSaver";
import { type Saver } from "./baseSavers/Saver";
import { Prisma } from "@prisma/client";

export class AdminRegionParser extends GeoJsonParser<AdminReginGeoJsonProperties> {
  saver: Saver = new BatchSaver(
    "AdminRegions",
    `"id", "Geometry", "Center", "Code", "Country", "CountryI2", "Name", "TypeLocal", "TypeEn", "Type", "Points", "Points2"`,
    10
  );

  constructor() {
    super("admin_regions_simplified.geojson");
  }

  async setupDatabase(
    transactionClient: PrismaTransactionClient
  ): Promise<void> {
    await transactionClient.$executeRaw`TRUNCATE TABLE "AdminRegions"`;
  }

  async saveElement(
    element: AdminReginGeoJsonProperties,
    geoJson: string,
    transactionClient: PrismaTransactionClient
  ): Promise<void> {
    await this.saver.onItemValues(
      transactionClient,
      Prisma.sql`
        (
          ${element.ID},
          ST_MakeValid4326(
            ST_SetSRID(
              ST_GeomFromGeoJSON(${geoJson}),
              4326
            )
          ),
          ST_SetSRID(ST_MakePoint(cast(${element.X_CENTRE} as double precision), cast(${element.Y_CENTRE} as double precision)), 4326),
          ${element.CODE},
          ${element.COUNTRY},
          ${element.COUNTRY_I2},
          ${element.NAME},
          ${element.TYPE_LOCAL},
          ${element.TYPE_EN},
          ${element.TYPE},
          ${element.points},
          ${element.points2}
        )
      `
    );
  }

  async onFinish(transactionClient: PrismaTransactionClient): Promise<void> {
    await this.saver.finish(transactionClient);
    await super.onFinish(transactionClient);
  }
}

//TODO maybe emun from type
interface AdminReginGeoJsonProperties {
  ID: number;
  CODE: string;
  COUNTRY: string;
  COUNTRY_I2: number;
  NAME: string;
  TYPE_LOCAL: string;
  TYPE_EN: string;
  TYPE: string;
  X_CENTRE: string;
  Y_CENTRE: string;
  points: string;
  points2: string;
}
