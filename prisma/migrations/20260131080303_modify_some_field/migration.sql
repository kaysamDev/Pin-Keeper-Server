/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `Collections` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Collections_name_key";

-- AlterTable
ALTER TABLE "Collections" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Locations" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Collections_userId_name_key" ON "Collections"("userId", "name");

-- CreateIndex
CREATE INDEX "Locations_userId_idx" ON "Locations"("userId");

-- CreateIndex
CREATE INDEX "Locations_latitude_longitude_idx" ON "Locations"("latitude", "longitude");
