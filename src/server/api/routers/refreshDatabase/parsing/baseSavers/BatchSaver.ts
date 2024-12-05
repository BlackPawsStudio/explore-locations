import { type Prisma } from "@prisma/client";
import { Saver } from "./Saver";
import { type PrismaTransactionClient } from "../baseParsers/Parser";

export class BatchSaver extends Saver {
  tableName: string;
  insertValuesNames: string;
  batchSize: number;
  buffer: Prisma.Sql[] = [];

  constructor(tableName: string, insertValuesNames: string, batchSize: number) {
    super();
    this.tableName = tableName;
    this.insertValuesNames = insertValuesNames;
    this.batchSize = batchSize;
  }

  getTableName(): string {
    return this.tableName;
  }
  getInsertValuesNames(): string {
    return this.insertValuesNames;
  }

  async onItemValues(
    transactionClient: PrismaTransactionClient,
    item: Prisma.Sql
  ): Promise<void> {
    this.buffer.push(item);
    if (this.buffer.length < this.batchSize) {
      return;
    }
    await this.processBuffer(transactionClient);
  }

  async processBuffer(transactionClient: PrismaTransactionClient) {
    const bufferCopy = this.buffer;
    this.buffer = [];

    await this.saveItems(transactionClient, bufferCopy);
  }

  async finish(transactionClient: PrismaTransactionClient): Promise<void> {
    await this.processBuffer(transactionClient);

    await super.finish(transactionClient);
  }
}
