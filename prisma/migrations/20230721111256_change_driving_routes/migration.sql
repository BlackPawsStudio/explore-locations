/*
  Warnings:

  - Added the required column `RegionFromId` to the `DrivingRoutes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `RegionToId` to the `DrivingRoutes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DrivingRoutes" ADD COLUMN     "RegionFromId" INTEGER NOT NULL,
ADD COLUMN     "RegionToId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "DrivingRoutes" ADD CONSTRAINT "DrivingRoutes_RegionFromId_fkey" FOREIGN KEY ("RegionFromId") REFERENCES "Regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrivingRoutes" ADD CONSTRAINT "DrivingRoutes_RegionToId_fkey" FOREIGN KEY ("RegionToId") REFERENCES "Regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
