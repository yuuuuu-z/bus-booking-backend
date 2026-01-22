/*
  Warnings:

  - You are about to drop the column `ImageUrl` on the `users` table. All the data in the column will be lost.
  - Made the column `password` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "users_phone_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "ImageUrl",
ADD COLUMN     "name" TEXT,
ALTER COLUMN "password" SET NOT NULL;
