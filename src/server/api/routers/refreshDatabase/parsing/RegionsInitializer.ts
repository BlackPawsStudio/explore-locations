import { exhaustiveMatchingGuard } from "~/src/server/utils/utils";
import { Parser, type PrismaTransactionClient } from "./baseParsers/Parser";
import { type RegionType } from "@prisma/client";

const REGIONS_TABLE_NAME_ENCODED = `"Regions"`;
const AREA_INTERSECTION_PERSENTAGE = "0.75";

export class RegionsInitializer extends Parser {
  async parse(transactionClient: PrismaTransactionClient): Promise<void> {
    await transactionClient.$executeRawUnsafe(
      `TRUNCATE TABLE ${REGIONS_TABLE_NAME_ENCODED} RESTART IDENTITY CASCADE `
    );
    await this.createContinents(transactionClient);
    await this.createCountries(transactionClient);
    await this.createAdminRegions(transactionClient);
    await this.createDistricts(transactionClient);
    await this.createMunicipalities(transactionClient);
    await this.createCities(transactionClient);
  }

  async createContinents(
    transactionClient: PrismaTransactionClient
  ): Promise<void> {
    await transactionClient.$executeRawUnsafe(`
      INSERT INTO 
      ${REGIONS_TABLE_NAME_ENCODED}
      ("Type", "Geometry", "Center", "Name", "IdParent", "IdOriginal") 
      SELECT 
      'continent', "Geometry", ST_Centroid("Geometry"), "Name", null, "id"
      FROM "Continents"`);
  }

  // countries has no type field in prisma schema
  async createCountries(
    transactionClient: PrismaTransactionClient
  ): Promise<void> {
    await this.createRegio(
      transactionClient,
      ["continent"],
      "country",
      "Countries",
      "Geometry",
      "Name",
      null,
      GeometryType.MULTIPOLYGON,
      true
    );
  }

  async createAdminRegions(
    transactionClient: PrismaTransactionClient
  ): Promise<void> {
    await this.createRegio(
      transactionClient,
      ["country"],
      "admin_region",
      "AdminRegions",
      "Geometry",
      "Name",
      null,
      GeometryType.MULTIPOLYGON,
      true
    );
  }

  async createDistricts(
    transactionClient: PrismaTransactionClient
  ): Promise<void> {
    await this.createRegio(
      transactionClient,
      ["admin_region", "country"],
      "district",
      "Districts",
      "Geometry",
      "Name",
      "Center",
      GeometryType.MULTIPOLYGON,
      true
    );
  }

  async createMunicipalities(
    transactionClient: PrismaTransactionClient
  ): Promise<void> {
    await this.createRegio(
      transactionClient,
      ["district", "admin_region", "country"],
      "municipality",
      "Municipalities",
      "Geometry",
      "Name",
      "Center",
      GeometryType.MULTIPOLYGON,
      true
    );
  }

  async createCities(
    transactionClient: PrismaTransactionClient
  ): Promise<void> {
    await this.createRegio(
      transactionClient,
      ["municipality", "district", "admin_region", "country"],
      "city",
      "Cities",
      "Geometry",
      "Name",
      "Geometry",
      GeometryType.POINT,
      true
    );
  }

  async createRegio(
    transactionClient: PrismaTransactionClient,
    prioritizedParentRegionTypes: RegionType[],
    childRegionType: RegionType,
    childSourceDbName: string,
    childGeometryColumn: string,
    childNameColumn: string,
    childCenterColumn: string | null, //if center is null, we will calculate center by ourself
    geometryType: GeometryType,
    allowMissingParent: boolean
  ): Promise<void> {
    await this.initUnhandledChildrenTables(
      transactionClient,
      childSourceDbName
    );

    let firstTime = true;

    for (const parentRegionType of prioritizedParentRegionTypes) {
      await this.initPossibleParentsTables(transactionClient, parentRegionType);

      await this.filterMatchingRegions(
        transactionClient,
        childGeometryColumn,
        geometryType,
        childNameColumn,
        childCenterColumn,
        firstTime
      );
      firstTime = false;
    }

    await this.insertResults(
      transactionClient,
      childRegionType,
      childGeometryColumn,
      childCenterColumn,
      geometryType,
      allowMissingParent
    );

    await this.resetTempTables(transactionClient);
  }

  async resetTempTables(
    transactionClient: PrismaTransactionClient
  ): Promise<void> {
    await transactionClient.$executeRaw`DROP TABLE IF EXISTS possible_parents;`;
    await transactionClient.$executeRaw`DROP TABLE IF EXISTS unhandled_children;`;
    await transactionClient.$executeRaw`DROP TABLE IF EXISTS results;`;
  }

  async initPossibleParentsTables(
    transactionClient: PrismaTransactionClient,
    parentRegionType: string
  ): Promise<void> {
    await transactionClient.$executeRaw`DROP TABLE IF EXISTS possible_parents;`;

    await transactionClient.$executeRawUnsafe(`
      SELECT * 
      INTO possible_parents
      FROM ${REGIONS_TABLE_NAME_ENCODED}
      WHERE "Type" = '${parentRegionType}'
    `);
  }

  async initUnhandledChildrenTables(
    transactionClient: PrismaTransactionClient,
    childSourceDbName: string
  ): Promise<void> {
    await transactionClient.$executeRaw`DROP TABLE IF EXISTS unhandled_children;`;

    await transactionClient.$executeRawUnsafe(`
      SELECT * 
      INTO unhandled_children
      FROM "${childSourceDbName}" OFFSET 0 LIMIT 1000;
    `);
  }

  async filterMatchingRegions(
    transactionClient: PrismaTransactionClient,
    childGeometryColumn: string,
    geometryType: GeometryType,
    childNameColumn: string,
    childCenterColumn: string | null,
    firstTime = true
  ): Promise<void> {
    let matchCondition: string;
    switch (geometryType) {
      case GeometryType.POINT:
        matchCondition = `
        ST_DWithin(unhandled_children."${childGeometryColumn}", possible_parents."Geometry", 0)
        `;
        break;

      case GeometryType.MULTIPOLYGON:
        matchCondition = `
        ST_Area(
          ST_Intersection4326(possible_parents."Geometry", unhandled_children."${childGeometryColumn}")
        ) / 
        ST_Area(unhandled_children."${childGeometryColumn}") 
        > ${AREA_INTERSECTION_PERSENTAGE}
        `;
        break;

      default:
        exhaustiveMatchingGuard(geometryType);
        matchCondition = "";
    }

    let centerSelector: string;
    if (childCenterColumn === null) {
      centerSelector = `ST_Centroid(unhandled_children."${childGeometryColumn}")`;
    } else {
      centerSelector = `unhandled_children."${childCenterColumn}"`;
    }
    await transactionClient.$executeRawUnsafe(`
      ${firstTime ? "" : "INSERT INTO results"}
      SELECT unhandled_children.id as id, 
            unhandled_children."${childGeometryColumn}" as "Geometry", 
            unhandled_children."${childNameColumn}" as "Name", 
            possible_parents.id as "IdParent",
            ${centerSelector} as "Center"
      ${firstTime ? "INTO results" : ""}
      FROM unhandled_children      
      LEFT JOIN possible_parents
      ON ${matchCondition}
      WHERE possible_parents.id IS NOT NULL;
    `);

    await transactionClient.$executeRaw`
      DELETE FROM unhandled_children
      WHERE id in (SELECT id FROM results);
    `;
  }

  async insertResults(
    transactionClient: PrismaTransactionClient,
    childRegionType: string,
    childGeometryColumn: string,
    childCenterColumn: string | null,
    geometryType: GeometryType,
    allowMissingParent: boolean
  ): Promise<void> {
    let additionalColumns: string;
    let additionalValues: string;
    switch (geometryType) {
      case GeometryType.POINT:
        additionalColumns = "";
        additionalValues = "";
        break;

      case GeometryType.MULTIPOLYGON:
        additionalColumns = `,"Geometry"`;
        additionalValues = `,"Geometry"`;
        break;

      default:
        additionalColumns = "";
        additionalValues = "";
        exhaustiveMatchingGuard(geometryType);
    }
    let centerSelector: string;
    if (childCenterColumn === null) {
      centerSelector = `ST_Centroid("${childGeometryColumn}")`;
    } else {
      centerSelector = `"${childCenterColumn}"`;
    }
    await transactionClient.$executeRawUnsafe(`
      INSERT INTO ${REGIONS_TABLE_NAME_ENCODED}
      ("Type", "Center", "Name", "IdParent", "IdOriginal" ${additionalColumns})
      ((SELECT '${childRegionType}'::"RegionType", "Center", "Name", "IdParent", id ${additionalValues} FROM results)
        ${
          allowMissingParent
            ? `
        UNION ALL 
        (SELECT '${childRegionType}'::"RegionType", ${centerSelector}, "Name", NULL, id ${additionalValues} FROM unhandled_children)
        `
            : ""
        }
        
      )
    `);

    const res =
      await transactionClient.$queryRaw`select COUNT(*) from unhandled_children;`;
    console.log(res);
  }
}

enum GeometryType {
  POINT,
  MULTIPOLYGON,
}
