/*
  Warnings:

  - You are about to drop the column `twitterLargeImageLink` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `twitterId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `twitterLink` on the `Post` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "PostForward" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platform" TEXT NOT NULL,
    "platformPostId" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "forwardAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "forwardConfigId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    CONSTRAINT "PostForward_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PostImport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platform" TEXT NOT NULL,
    "platformPostId" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "importedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postId" TEXT NOT NULL,
    CONSTRAINT "PostImport_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ImageImport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platform" TEXT NOT NULL,
    "platformImageId" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "importedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imageId" TEXT NOT NULL,
    CONSTRAINT "ImageImport_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alt" TEXT,
    "path" TEXT NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "smallSize" INTEGER NOT NULL DEFAULT 0,
    "largeSize" INTEGER NOT NULL DEFAULT 0,
    "originalSize" INTEGER NOT NULL DEFAULT 0,
    "originalPath" TEXT
);
INSERT INTO "new_Image" ("addedAt", "alt", "id", "largeSize", "originalPath", "originalSize", "path", "smallSize") SELECT "addedAt", "alt", "id", "largeSize", "originalPath", "originalSize", "path", "smallSize" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE TABLE "new_Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "imagesOrder" TEXT,
    "parentPostId" TEXT,
    CONSTRAINT "Post_parentPostId_fkey" FOREIGN KEY ("parentPostId") REFERENCES "Post" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("addedAt", "content", "createdAt", "id", "imagesOrder", "isDeleted", "parentPostId") SELECT "addedAt", "content", "createdAt", "id", "imagesOrder", "isDeleted", "parentPostId" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ImageImport_imageId_key" ON "ImageImport"("imageId");
