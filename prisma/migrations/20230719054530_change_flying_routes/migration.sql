/*
  Warnings:

  - You are about to drop the column `DestinationCityId` on the `FlyingRoutes` table. All the data in the column will be lost.
  - You are about to drop the column `DestinationCountryId` on the `FlyingRoutes` table. All the data in the column will be lost.
  - You are about to drop the column `DestinationCountryName` on the `FlyingRoutes` table. All the data in the column will be lost.
  - You are about to drop the column `DestinationIata` on the `FlyingRoutes` table. All the data in the column will be lost.
  - You are about to drop the column `DestinationIcao` on the `FlyingRoutes` table. All the data in the column will be lost.
  - You are about to drop the column `OriginCityId` on the `FlyingRoutes` table. All the data in the column will be lost.
  - You are about to drop the column `OriginCountryId` on the `FlyingRoutes` table. All the data in the column will be lost.
  - You are about to drop the column `OriginCountryName` on the `FlyingRoutes` table. All the data in the column will be lost.
  - You are about to drop the column `OriginIata` on the `FlyingRoutes` table. All the data in the column will be lost.
  - You are about to drop the column `OriginIcao` on the `FlyingRoutes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FlyingRoutes" DROP COLUMN "DestinationCityId",
DROP COLUMN "DestinationCountryId",
DROP COLUMN "DestinationCountryName",
DROP COLUMN "DestinationIata",
DROP COLUMN "DestinationIcao",
DROP COLUMN "OriginCityId",
DROP COLUMN "OriginCountryId",
DROP COLUMN "OriginCountryName",
DROP COLUMN "OriginIata",
DROP COLUMN "OriginIcao";
