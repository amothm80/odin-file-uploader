/*
  Warnings:

  - You are about to drop the column `location` on the `File` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "location",
ADD COLUMN     "localfilename" TEXT,
ADD COLUMN     "mimetype" TEXT,
ALTER COLUMN "size" DROP NOT NULL;
