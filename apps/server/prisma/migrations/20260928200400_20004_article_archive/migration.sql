-- WeWe RSS 20004 Edition v0.1.0
ALTER TABLE `articles`
  ADD COLUMN `content_html` LONGTEXT NULL,
  ADD COLUMN `content_text` LONGTEXT NULL,
  ADD COLUMN `archive_status` INT NOT NULL DEFAULT 0,
  ADD COLUMN `archive_error` TEXT NULL,
  ADD COLUMN `archived_at` DATETIME(3) NULL;

CREATE INDEX `articles_mp_id_archive_status_idx`
  ON `articles`(`mp_id`, `archive_status`);
