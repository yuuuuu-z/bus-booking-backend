-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otpExpires" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "OTP" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("id")
);
