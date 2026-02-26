/*
  Warnings:

  - A unique constraint covering the columns `[resource,action]` on the table `permission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "letter_history" (
    "id" TEXT NOT NULL,
    "letter_instance_id" TEXT NOT NULL,
    "actor_id" TEXT NOT NULL,
    "status" "letter_status" NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "letter_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "letter_draft" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "data" JSONB NOT NULL,
    "letter_type_id" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "letter_draft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "permission_resource_action_key" ON "permission"("resource", "action");

-- AddForeignKey
ALTER TABLE "letter_history" ADD CONSTRAINT "letter_history_letter_instance_id_fkey" FOREIGN KEY ("letter_instance_id") REFERENCES "letter_instance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "letter_history" ADD CONSTRAINT "letter_history_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "letter_draft" ADD CONSTRAINT "letter_draft_letter_type_id_fkey" FOREIGN KEY ("letter_type_id") REFERENCES "letter_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "letter_draft" ADD CONSTRAINT "letter_draft_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
