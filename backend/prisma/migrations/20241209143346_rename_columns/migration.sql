/*
  Warnings:

  - You are about to drop the column `fromId` on the `chat` table. All the data in the column will be lost.
  - You are about to drop the column `toId` on the `chat` table. All the data in the column will be lost.
  - The primary key for the `connection` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fromId` on the `connection` table. All the data in the column will be lost.
  - You are about to drop the column `toId` on the `connection` table. All the data in the column will be lost.
  - The primary key for the `connection_request` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fromId` on the `connection_request` table. All the data in the column will be lost.
  - You are about to drop the column `toId` on the `connection_request` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `feed` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `push_subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - Added the required column `from_id` to the `chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_id` to the `chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `from_id` to the `connection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_id` to the `connection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `from_id` to the `connection_request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_id` to the `connection_request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `feed` table without a default value. This is not possible if the table is not empty.
  - Added the required column `full_name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chat" DROP CONSTRAINT "chat_fromId_fkey";

-- DropForeignKey
ALTER TABLE "chat" DROP CONSTRAINT "chat_toId_fkey";

-- DropForeignKey
ALTER TABLE "connection" DROP CONSTRAINT "connection_fromId_fkey";

-- DropForeignKey
ALTER TABLE "connection" DROP CONSTRAINT "connection_toId_fkey";

-- DropForeignKey
ALTER TABLE "connection_request" DROP CONSTRAINT "connection_request_fromId_fkey";

-- DropForeignKey
ALTER TABLE "connection_request" DROP CONSTRAINT "connection_request_toId_fkey";

-- DropForeignKey
ALTER TABLE "feed" DROP CONSTRAINT "feed_userId_fkey";

-- DropForeignKey
ALTER TABLE "push_subscriptions" DROP CONSTRAINT "push_subscriptions_userId_fkey";

-- AlterTable
ALTER TABLE "chat" DROP COLUMN "fromId",
DROP COLUMN "toId",
ADD COLUMN     "from_id" BIGINT NOT NULL,
ADD COLUMN     "to_id" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "connection" DROP CONSTRAINT "connection_pkey",
DROP COLUMN "fromId",
DROP COLUMN "toId",
ADD COLUMN     "from_id" BIGINT NOT NULL,
ADD COLUMN     "to_id" BIGINT NOT NULL,
ADD CONSTRAINT "connection_pkey" PRIMARY KEY ("from_id", "to_id");

-- AlterTable
ALTER TABLE "connection_request" DROP CONSTRAINT "connection_request_pkey",
DROP COLUMN "fromId",
DROP COLUMN "toId",
ADD COLUMN     "from_id" BIGINT NOT NULL,
ADD COLUMN     "to_id" BIGINT NOT NULL,
ADD CONSTRAINT "connection_request_pkey" PRIMARY KEY ("from_id", "to_id");

-- AlterTable
ALTER TABLE "feed" DROP COLUMN "userId",
ADD COLUMN     "user_id" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "push_subscriptions" DROP COLUMN "userId",
ADD COLUMN     "user_id" BIGINT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "name",
ADD COLUMN     "full_name" VARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE "feed" ADD CONSTRAINT "feed_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connection_request" ADD CONSTRAINT "connection_request_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connection_request" ADD CONSTRAINT "connection_request_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connection" ADD CONSTRAINT "connection_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connection" ADD CONSTRAINT "connection_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
