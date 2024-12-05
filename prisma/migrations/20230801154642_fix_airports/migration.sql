/*
  Warnings:

  - Made the column `NameEn` on table `Airports` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Airports" ALTER COLUMN "NameEn" SET NOT NULL;
