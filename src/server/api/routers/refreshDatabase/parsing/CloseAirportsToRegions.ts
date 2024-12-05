import { Parser, type PrismaTransactionClient } from "./baseParsers/Parser";

export class CloseAirportsToRegions extends Parser {
  async parse(transactionClient: PrismaTransactionClient): Promise<void> {
    await transactionClient.$executeRaw`
        INSERT INTO "CloseAirportsToRegions"
        (id, "closeAirportsCount")  
        SELECT id, get_close_regions_size(id) FROM "Regions"  
    `;
  }
}
