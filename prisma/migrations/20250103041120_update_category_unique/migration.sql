/*
  Warnings:

  - A unique constraint covering the columns `[category]` on the table `tickets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tickets_category_key" ON "tickets"("category");
