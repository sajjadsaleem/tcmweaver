/*
  Warnings:

  - You are about to drop the column `filename` on the `Dataset` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fileName]` on the table `Dataset` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileName` to the `Dataset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `full_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Dataset_filename_key";

-- AlterTable
ALTER TABLE "Dataset" DROP COLUMN "filename",
ADD COLUMN     "fileName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "full_name" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Dataset_fileName_key" ON "Dataset"("fileName");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
