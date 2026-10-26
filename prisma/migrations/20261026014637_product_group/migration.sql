/*
  Warnings:

  - You are about to drop the column `showStock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `showTop` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stockUpdateTime` on the `Product` table. All the data in the column will be lost.
  - Added the required column `groupId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "showStock",
DROP COLUMN "showTop",
DROP COLUMN "stockUpdateTime",
ADD COLUMN     "groupId" TEXT NOT NULL,
ADD COLUMN     "showStockDetail" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "ProductGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "showTop" BOOLEAN NOT NULL DEFAULT false,
    "imgId" TEXT,

    CONSTRAINT "ProductGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductGroupLangMap" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "productGroupId" TEXT NOT NULL,
    "langId" TEXT NOT NULL,

    CONSTRAINT "ProductGroupLangMap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductGroupLangMap_productGroupId_langId_key" ON "ProductGroupLangMap"("productGroupId", "langId");

-- AddForeignKey
ALTER TABLE "ProductGroup" ADD CONSTRAINT "ProductGroup_imgId_fkey" FOREIGN KEY ("imgId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductGroupLangMap" ADD CONSTRAINT "ProductGroupLangMap_productGroupId_fkey" FOREIGN KEY ("productGroupId") REFERENCES "ProductGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductGroupLangMap" ADD CONSTRAINT "ProductGroupLangMap_langId_fkey" FOREIGN KEY ("langId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ProductGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
