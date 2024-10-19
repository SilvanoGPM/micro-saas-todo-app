-- AlterTable
ALTER TABLE `todos` MODIFY `notes` TEXT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `users` ADD COLUMN `stripe_notes_paid` BOOLEAN NOT NULL DEFAULT false;
