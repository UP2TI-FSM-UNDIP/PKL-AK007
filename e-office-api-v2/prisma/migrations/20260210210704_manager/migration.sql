/*
  Warnings:

  - Added the required column `mime_type` to the `attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `attachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attachment" ADD COLUMN     "is_main" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "label" TEXT,
ADD COLUMN     "letter_draft_id" TEXT,
ADD COLUMN     "letter_instance_id" TEXT,
ADD COLUMN     "mime_type" TEXT NOT NULL,
ADD COLUMN     "original_name" TEXT,
ADD COLUMN     "owner_id" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_letter_draft_id_fkey" FOREIGN KEY ("letter_draft_id") REFERENCES "letter_draft"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_letter_instance_id_fkey" FOREIGN KEY ("letter_instance_id") REFERENCES "letter_instance"("id") ON DELETE SET NULL ON UPDATE CASCADE;
