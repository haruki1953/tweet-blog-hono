/*
  Warnings:

  - You are about to drop the column `platformPostId` on the `ImageForward` table. All the data in the column will be lost.
  - Added the required column `platformImageId` to the `ImageForward` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ImageForward" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platform" TEXT NOT NULL,
    "platformImageId" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "forwardAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "forwardConfigId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    CONSTRAINT "ImageForward_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ImageForward" ("forwardAt", "forwardConfigId", "id", "imageId", "link", "platform") SELECT "forwardAt", "forwardConfigId", "id", "imageId", "link", "platform" FROM "ImageForward";
DROP TABLE "ImageForward";
ALTER TABLE "new_ImageForward" RENAME TO "ImageForward";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
