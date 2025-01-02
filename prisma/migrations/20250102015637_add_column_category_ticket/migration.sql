/*
  Warnings:

  - Added the required column `category` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TicketsCategory" AS ENUM ('Sport', 'Music_Concert', 'Workshop');

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "category" "TicketsCategory" NOT NULL;
