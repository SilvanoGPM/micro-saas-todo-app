-- AlterTable
ALTER TABLE `todos` MODIFY `notes` TEXT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `users` ADD COLUMN `allow_email_notifications` BOOLEAN NULL DEFAULT true,
    ADD COLUMN `allow_push_notifications` BOOLEAN NULL DEFAULT true,
    MODIFY `notifications_subscription` TEXT NULL DEFAULT '';
