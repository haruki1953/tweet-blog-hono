-- CreateTable
CREATE TABLE "ImageForward" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platform" TEXT NOT NULL,
    "platformPostId" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "forwardAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "forwardConfigId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    CONSTRAINT "ImageForward_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
