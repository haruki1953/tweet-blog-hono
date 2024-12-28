-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ImageImport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platform" TEXT NOT NULL,
    "platformImageId" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "importedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imageId" TEXT NOT NULL,
    CONSTRAINT "ImageImport_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ImageImport" ("id", "imageId", "importedAt", "link", "platform", "platformImageId") SELECT "id", "imageId", "importedAt", "link", "platform", "platformImageId" FROM "ImageImport";
DROP TABLE "ImageImport";
ALTER TABLE "new_ImageImport" RENAME TO "ImageImport";
CREATE TABLE "new_PostForward" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platform" TEXT NOT NULL,
    "platformPostId" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "forwardAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "forwardConfigId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    CONSTRAINT "PostForward_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PostForward" ("forwardAt", "forwardConfigId", "id", "link", "platform", "platformPostId", "postId") SELECT "forwardAt", "forwardConfigId", "id", "link", "platform", "platformPostId", "postId" FROM "PostForward";
DROP TABLE "PostForward";
ALTER TABLE "new_PostForward" RENAME TO "PostForward";
CREATE TABLE "new_PostImport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platform" TEXT NOT NULL,
    "platformPostId" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "importedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postId" TEXT NOT NULL,
    CONSTRAINT "PostImport_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PostImport" ("id", "importedAt", "link", "platform", "platformPostId", "postId") SELECT "id", "importedAt", "link", "platform", "platformPostId", "postId" FROM "PostImport";
DROP TABLE "PostImport";
ALTER TABLE "new_PostImport" RENAME TO "PostImport";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
