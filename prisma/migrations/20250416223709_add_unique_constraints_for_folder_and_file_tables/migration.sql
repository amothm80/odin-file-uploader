/*
  Warnings:

  - A unique constraint covering the columns `[name,userId,folderId]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,userId]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "File_name_userId_folderId_key" ON "File"("name", "userId", "folderId");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_name_userId_key" ON "Folder"("name", "userId");
