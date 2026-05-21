-- AlterTable
ALTER TABLE "speakers" ALTER COLUMN "image" SET DEFAULT '';

-- AlterTable
ALTER TABLE "events" ALTER COLUMN "description" SET DEFAULT '';

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
