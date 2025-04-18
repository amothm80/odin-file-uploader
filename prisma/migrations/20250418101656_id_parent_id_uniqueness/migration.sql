/*
  Warnings:

  - A unique constraint covering the columns `[id,parentFolderId]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Folder_id_parentFolderId_key" ON "Folder"("id", "parentFolderId");
