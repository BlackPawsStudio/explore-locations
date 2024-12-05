import { type PrismaTransactionClient } from "./baseParsers/Parser";
import { GeoJsonParser } from "./baseParsers/GeoJsonParser";
import { BatchSaver } from "./baseSavers/BatchSaver";
import { type Saver } from "./baseSavers/Saver";
import { Prisma } from "@prisma/client";

export class CountriesParser extends GeoJsonParser<CountryGeoJsonProperties> {
  saver: Saver = new BatchSaver(
    "Countries",
    `"id", "Geometry", "Name", "Code"`,
    10
  );

  constructor() {
    super("countries.geojson");
  }

  async setupDatabase(
    transactionClient: PrismaTransactionClient
  ): Promise<void> {
    await transactionClient.$executeRaw`TRUNCATE TABLE "Countries"`;
  }

  async saveElement(
    element: CountryGeoJsonProperties,
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
        ${element.NAME}, 
        ${element.CODE}
      )`
    );
  }

  async onFinish(transactionClient: PrismaTransactionClient): Promise<void> {
    await this.saver.finish(transactionClient);
    await super.onFinish(transactionClient);
  }
}

interface CountryGeoJsonProperties {
  ID: number;
  NAME: string;
  CODE: string;
}
