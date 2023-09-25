/*
  Warnings:

  - A unique constraint covering the columns `[filename]` on the table `Dataset` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "username" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "Dataset_filename_key" ON "Dataset"("filename");
