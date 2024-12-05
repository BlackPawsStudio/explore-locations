import { Prisma } from "@prisma/client";
import { type PrismaTransactionClient } from "../baseParsers/Parser";

export abstract class Saver {
  savedItemsAmount = 0;

  async saveItems(
    transactionClient: PrismaTransactionClient,
    items: Prisma.Sql[]
  ): Promise<void> {
    if (items.length === 0) {
      return;
    }
    const joiedItems = Prisma.join(items);
    let sql = `
    INSERT INTO \"${this.getTableName()}\" 
    (${this.getInsertValuesNames()})
    VALUES
    ${joiedItems.text}
  `;
    sql = sql.replaceAll("\n", "").replaceAll(/ +/g, " ");
    await transactionClient.$executeRawUnsafe(sql, ...joiedItems.values);

    this.savedItemsAmount += items.length;
    console.log(
      `Inserted ${this.savedItemsAmount} into ${this.getTableName()} table`
    );
  }

  abstract getTableName(): string;
  abstract getInsertValuesNames(): string;

  abstract onItemValues(
    transactionClient: PrismaTransactionClient,
    item: Prisma.Sql
  ): Promise<void>;

  finish(_transactionClient: PrismaTransactionClient): Promise<void> {
    this.savedItemsAmount = 0;
    return Promise.resolve();
  }
}
