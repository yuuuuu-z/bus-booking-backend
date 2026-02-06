/*
  Warnings:

  - You are about to drop the `bookings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `buses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `provinces` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `seats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `trips` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_tripId_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_userId_fkey";

-- DropForeignKey
ALTER TABLE "seats" DROP CONSTRAINT "seats_busId_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_busId_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_fromProvinceId_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_toProvinceId_fkey";

-- DropTable
DROP TABLE "bookings";

-- DropTable
DROP TABLE "buses";

-- DropTable
DROP TABLE "provinces";

-- DropTable
DROP TABLE "seats";

-- DropTable
DROP TABLE "trips";

-- CreateTable
CREATE TABLE "province" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "province_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "fromProvinceId" INTEGER NOT NULL,
    "toProvinceId" INTEGER NOT NULL,
    "travelDate" TIMESTAMP(3) NOT NULL,
    "timeLabel" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "tickets" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "province_name_key" ON "province"("name");

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_fromProvinceId_fkey" FOREIGN KEY ("fromProvinceId") REFERENCES "province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_toProvinceId_fkey" FOREIGN KEY ("toProvinceId") REFERENCES "province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
