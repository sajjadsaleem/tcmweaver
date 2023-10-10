/*
  Warnings:

  - You are about to drop the column `fileName` on the `Dataset` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[filename]` on the table `Dataset` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `filename` to the `Dataset` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Dataset_fileName_key";

-- AlterTable
ALTER TABLE "Dataset" DROP COLUMN "fileName",
ADD COLUMN     "filename" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Dataset_filename_key" ON "Dataset"("filename");
