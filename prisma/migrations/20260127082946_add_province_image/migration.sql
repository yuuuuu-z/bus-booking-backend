/*
  Warnings:

  - Made the column `image` on table `province` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "province" ALTER COLUMN "image" SET NOT NULL;
