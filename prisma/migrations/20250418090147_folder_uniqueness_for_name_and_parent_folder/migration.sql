/*
  Warnings:

  - A unique constraint covering the columns `[name,parentFolderId]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Folder_name_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Folder_name_parentFolderId_key" ON "Folder"("name", "parentFolderId");
