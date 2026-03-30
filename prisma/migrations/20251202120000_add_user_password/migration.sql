-- AlterTable: add password column and adjust default role
ALTER TABLE `user`
    ADD COLUMN `password` VARCHAR(191) NULL,
    MODIFY `role` VARCHAR(191) NOT NULL DEFAULT 'customer';

-- Copy any existing hashed passwords into the new column
UPDATE `user`
SET `password` = `passwordHash`
WHERE `passwordHash` IS NOT NULL;

-- Backfill missing password values with a temporary hash
UPDATE `user`
SET `password` = '$2a$10$Wr8OjisSFbAZ0m6W7akI7.qiobUlyRUtLR/mMayNWqnVhKMOaiODy'
WHERE `password` IS NULL;

-- Ensure phone numbers exist for all rows before enforcing NOT NULL + UNIQUE
UPDATE `user`
SET `phone` = CONCAT('0000000000', `id`)
WHERE `phone` IS NULL OR `phone` = '';

-- Finalize schema changes: enforce NOT NULL and remove the old column
ALTER TABLE `user`
    MODIFY `phone` VARCHAR(191) NOT NULL,
    MODIFY `password` VARCHAR(191) NOT NULL,
    DROP COLUMN `passwordHash`;

-- Add unique constraint for phone numbers
CREATE UNIQUE INDEX `User_phone_key` ON `user`(`phone`);





