/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `verification_tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "verification_tokens_identifier_token_key";

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");
