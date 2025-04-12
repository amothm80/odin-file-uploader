/*
  Warnings:

  - Added the required column `size` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "size" INTEGER NOT NULL,
ADD COLUMN     "uploadTime" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "creationDate" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
