/*
  Warnings:

  - You are about to drop the `trip` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "trip" DROP CONSTRAINT "trip_fromProvinceId_fkey";

-- DropForeignKey
ALTER TABLE "trip" DROP CONSTRAINT "trip_toProvinceId_fkey";

-- DropTable
DROP TABLE "trip";

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

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
