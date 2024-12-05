-- CreateEnum
CREATE TYPE "RegionStatus" AS ENUM ('Published', 'Draft');

-- AlterTable
ALTER TABLE "Regions" ADD COLUMN     "Status" "RegionStatus" NOT NULL DEFAULT 'Published';
