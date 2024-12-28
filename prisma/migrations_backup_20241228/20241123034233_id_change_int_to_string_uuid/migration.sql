/*
  Warnings:

  - The primary key for the `Image` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
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
    "originalPath" TEXT,
    "twitterLargeImageLink" TEXT
);
INSERT INTO "new_Image" ("addedAt", "alt", "id", "largeSize", "originalPath", "originalSize", "path", "smallSize", "twitterLargeImageLink") SELECT "addedAt", "alt", "id", "largeSize", "originalPath", "originalSize", "path", "smallSize", "twitterLargeImageLink" FROM "Image";
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
    "twitterId" TEXT,
    "twitterLink" TEXT,
    CONSTRAINT "Post_parentPostId_fkey" FOREIGN KEY ("parentPostId") REFERENCES "Post" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("addedAt", "content", "createdAt", "id", "imagesOrder", "isDeleted", "parentPostId", "twitterId", "twitterLink") SELECT "addedAt", "content", "createdAt", "id", "imagesOrder", "isDeleted", "parentPostId", "twitterId", "twitterLink" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE UNIQUE INDEX "Post_twitterId_key" ON "Post"("twitterId");
CREATE TABLE "new__PostImages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PostImages_A_fkey" FOREIGN KEY ("A") REFERENCES "Image" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PostImages_B_fkey" FOREIGN KEY ("B") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__PostImages" ("A", "B") SELECT "A", "B" FROM "_PostImages";
DROP TABLE "_PostImages";
ALTER TABLE "new__PostImages" RENAME TO "_PostImages";
CREATE UNIQUE INDEX "_PostImages_AB_unique" ON "_PostImages"("A", "B");
CREATE INDEX "_PostImages_B_index" ON "_PostImages"("B");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
