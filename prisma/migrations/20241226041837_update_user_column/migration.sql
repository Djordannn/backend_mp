-- AlterTable
ALTER TABLE "users" ADD COLUMN     "imgProfile" TEXT,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;
