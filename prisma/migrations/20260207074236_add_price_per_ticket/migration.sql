/*
  Warnings:

  - You are about to drop the column `amount` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `bakongMd5` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `bakongTranId` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `paymentStatus` on the `booking` table. All the data in the column will be lost.
  - Added the required column `pricePerTicket` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "booking" DROP COLUMN "amount",
DROP COLUMN "bakongMd5",
DROP COLUMN "bakongTranId",
DROP COLUMN "paymentStatus",
ADD COLUMN     "paymentRef" TEXT,
ADD COLUMN     "pricePerTicket" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL;
