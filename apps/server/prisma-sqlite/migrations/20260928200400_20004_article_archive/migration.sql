-- WeWe RSS 20004 Edition v0.1.0
ALTER TABLE "articles" ADD COLUMN "content_html" TEXT;
ALTER TABLE "articles" ADD COLUMN "content_text" TEXT;
ALTER TABLE "articles" ADD COLUMN "archive_status" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "articles" ADD COLUMN "archive_error" TEXT;
ALTER TABLE "articles" ADD COLUMN "archived_at" DATETIME;

CREATE INDEX "articles_mp_id_archive_status_idx"
  ON "articles"("mp_id", "archive_status");
