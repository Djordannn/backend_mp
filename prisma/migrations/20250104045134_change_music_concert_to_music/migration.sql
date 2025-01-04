/*
  Warnings:

  - The values [Music_Concert] on the enum `TicketsCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TicketsCategory_new" AS ENUM ('Sport', 'Music', 'Workshop');
ALTER TABLE "tickets" ALTER COLUMN "category" TYPE "TicketsCategory_new" USING ("category"::text::"TicketsCategory_new");
ALTER TYPE "TicketsCategory" RENAME TO "TicketsCategory_old";
ALTER TYPE "TicketsCategory_new" RENAME TO "TicketsCategory";
DROP TYPE "TicketsCategory_old";
COMMIT;
