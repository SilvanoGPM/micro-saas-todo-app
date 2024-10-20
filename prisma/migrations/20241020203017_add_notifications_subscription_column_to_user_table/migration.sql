-- AlterTable
ALTER TABLE `todos` MODIFY `notes` TEXT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `users` ADD COLUMN `notifications_subscription` TEXT NULL DEFAULT '';
