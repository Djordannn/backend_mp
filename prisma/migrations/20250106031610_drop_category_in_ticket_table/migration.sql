/*
  Warnings:

  - You are about to drop the column `category` on the `tickets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "category";

-- DropEnum
DROP TYPE "TicketsCategory";
