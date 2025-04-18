/*
  Warnings:

  - A unique constraint covering the columns `[parentFolderId]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "parentFolderId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Folder_parentFolderId_key" ON "Folder"("parentFolderId");

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentFolderId_fkey" FOREIGN KEY ("parentFolderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
