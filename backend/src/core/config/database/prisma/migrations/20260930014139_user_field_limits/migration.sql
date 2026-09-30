/*
  Warnings:

  - You are about to alter the column `name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(120)` to `VarChar(30)`.
  - You are about to alter the column `registration` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(30)` to `VarChar(10)`.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(160)` to `VarChar(40)`.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "registration" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(40);
