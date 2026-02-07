-- AlterTable
ALTER TABLE "booking" ADD COLUMN "amount" DOUBLE PRECISION,
ADD COLUMN "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN "bakongMd5" TEXT,
ADD COLUMN "bakongTranId" TEXT;
