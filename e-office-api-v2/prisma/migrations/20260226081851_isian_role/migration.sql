/*
  Warnings:

  - Made the column `departemenId` on table `pegawai` required. This step will fail if there are existing NULL values in that column.
  - Made the column `programStudiId` on table `pegawai` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "mahasiswa" DROP CONSTRAINT "mahasiswa_departemenId_fkey";

-- DropForeignKey
ALTER TABLE "mahasiswa" DROP CONSTRAINT "mahasiswa_programStudiId_fkey";

-- AlterTable
ALTER TABLE "mahasiswa" ALTER COLUMN "departemenId" DROP NOT NULL,
ALTER COLUMN "programStudiId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "pegawai" ALTER COLUMN "departemenId" SET NOT NULL,
ALTER COLUMN "programStudiId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "mahasiswa" ADD CONSTRAINT "mahasiswa_departemenId_fkey" FOREIGN KEY ("departemenId") REFERENCES "departemen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mahasiswa" ADD CONSTRAINT "mahasiswa_programStudiId_fkey" FOREIGN KEY ("programStudiId") REFERENCES "program_studi"("id") ON DELETE SET NULL ON UPDATE CASCADE;
