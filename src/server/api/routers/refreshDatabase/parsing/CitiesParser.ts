import { type PrismaTransactionClient } from "./baseParsers/Parser";
import { GeoJsonParser } from "./baseParsers/GeoJsonParser";
import { BatchSaver } from "./baseSavers/BatchSaver";
import { type Saver } from "./baseSavers/Saver";
import { Prisma } from "@prisma/client";

export class CitiesParser extends GeoJsonParser<CitiesGeoJsonProperties> {
  saver: Saver = new BatchSaver(
    "Cities",
    `"id", "Geometry", "Name", "Type", "NameAlt", "Country", "ISO2", "ISO3", "ParentADM", "Capital", "Population"`,
    100
  );

  constructor() {
    super("cities.geojson");
  }

  async setupDatabase(
    transactionClient: PrismaTransactionClient
  ): Promise<void> {
    await transactionClient.$executeRaw`TRUNCATE TABLE "Cities"`;
  }

  async saveElement(
    element: CitiesGeoJsonProperties,
    geoJson: string,
    transactionClient: PrismaTransactionClient
  ): Promise<void> {
    const bigIntPopulation = BigInt(element.population.replaceAll(",", ""));

    await this.saver.onItemValues(
      transactionClient,
      Prisma.sql`
      (${element.ID},
        ST_SetSRID(
          ST_GeomFromGeoJSON(${geoJson}), 
          4326
        ),
        ${element.name},
        ${element.type},
        ${element.name_alt},
        ${element.country},
        ${element.iso2},
        ${element.iso3},
        ${element.parent_adm},
        ${element.capital},
        ${bigIntPopulation}
      )
      `
    );
  }

  async onFinish(transactionClient: PrismaTransactionClient): Promise<void> {
    await this.saver.finish(transactionClient);
    await super.onFinish(transactionClient);
  }
}

interface CitiesGeoJsonProperties {
  ID: number;
  name: string;
  type: string;
  name_alt: string;
  country: string;
  iso2: string;
  iso3: string;
  parent_adm: string;
  capital: string;
  population: string;
}
