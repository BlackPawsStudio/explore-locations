import { type PrismaTransactionClient } from "./baseParsers/Parser";
import { GeoJsonParser } from "./baseParsers/GeoJsonParser";
import { Prisma } from "@prisma/client";
import { BatchSaver } from "./baseSavers/BatchSaver";
import { type Saver } from "./baseSavers/Saver";

export class MunicipalitiesParser extends GeoJsonParser<MunicipalitiesGeoJsonProperties> {
  saver: Saver = new BatchSaver(
    "Municipalities",
    `"id", "Geometry", "Center", "Code", "Country", "CountryID", "ParentADM", "ParentDIS", "Name", "TypeLocal", "Type"`,
    50
  );

  constructor() {
    super("municipalities_simplified.geojson");
  }

  async setupDatabase(
    transactionClient: PrismaTransactionClient
  ): Promise<void> {
    await transactionClient.$executeRaw`TRUNCATE TABLE "Municipalities"`;
  }

  async saveElement(
    element: MunicipalitiesGeoJsonProperties,
    geoJson: string,
    transactionClient: PrismaTransactionClient
  ): Promise<void> {
    await this.saver.onItemValues(
      transactionClient,
      Prisma.sql`
      (${element.ID},
        ST_MakeValid4326(
          ST_SetSRID(
            ST_GeomFromGeoJSON(${geoJson}), 
            4326
          )
        ),
        ST_SetSRID(ST_MakePoint(cast(${element.X_CENTRE} as double precision), cast(${element.Y_CENTRE} as double precision)), 4326),
        ${element.CODE},
        ${element.COUNTRY},
        ${element.COUNTRY_ID},
        ${element.PARENT_ADM},
        ${element.PARENT_DIS},
        ${element.NAME},
        ${element.TYPE_LOCAL},
        ${element.TYPE}
      )
      `
    );
  }

  async onFinish(transactionClient: PrismaTransactionClient): Promise<void> {
    await this.saver.finish(transactionClient);
    await super.onFinish(transactionClient);
  }
}

interface MunicipalitiesGeoJsonProperties {
  ID: number;
  CODE: string;
  COUNTRY: string;
  COUNTRY_ID: number;
  PARENT_ADM: string;
  PARENT_DIS: string;
  NAME: string;
  TYPE_LOCAL: string;
  TYPE: string;
  X_CENTRE: string;
  Y_CENTRE: string;
}
