/*
  Warnings:

  - Made the column `content` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "parentPostId" INTEGER,
    "twitterId" TEXT,
    "twitterLink" TEXT,
    CONSTRAINT "Post_parentPostId_fkey" FOREIGN KEY ("parentPostId") REFERENCES "Post" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("addedAt", "content", "createdAt", "id", "isDeleted", "parentPostId", "twitterId", "twitterLink") SELECT "addedAt", "content", "createdAt", "id", "isDeleted", "parentPostId", "twitterId", "twitterLink" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE UNIQUE INDEX "Post_twitterId_key" ON "Post"("twitterId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
