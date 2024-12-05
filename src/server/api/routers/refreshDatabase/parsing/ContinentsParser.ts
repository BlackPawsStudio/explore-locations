import { type PrismaTransactionClient } from "./baseParsers/Parser";
import { GeoJsonParser } from "./baseParsers/GeoJsonParser";
import { BatchSaver } from "./baseSavers/BatchSaver";
import { type Saver } from "./baseSavers/Saver";
import { Prisma } from "@prisma/client";

export class ContinentsParser extends GeoJsonParser<ContinentsGeoJsonProperties> {
  saver: Saver = new BatchSaver(
    "Continents",
    `"id", "Geometry", "Name", "Type"`,
    1
  );

  constructor() {
    super("continents.geojson");
  }

  async setupDatabase(
    transactionClient: PrismaTransactionClient
  ): Promise<void> {
    await transactionClient.$executeRaw`TRUNCATE TABLE "Continents"`;
  }

  async saveElement(
    element: ContinentsGeoJsonProperties,
    geoJson: string,
    transactionClient: PrismaTransactionClient
  ): Promise<void> {
    await this.saver.onItemValues(
      transactionClient,
      Prisma.sql`
      (${element.ID},
        ST_SetSRID(
          ST_GeomFromGeoJSON(${geoJson}), 
          4326
        ),
        ${element.NAME},
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

interface ContinentsGeoJsonProperties {
  ID: number;
  NAME: string;
  TYPE: string;
}
