/*
  Warnings:

  - You are about to drop the column `roomChatId` on the `chat` table. All the data in the column will be lost.
  - You are about to drop the `RoomChat` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `chatRoomId` to the `chat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RoomChat" DROP CONSTRAINT "RoomChat_firstUserId_fkey";

-- DropForeignKey
ALTER TABLE "RoomChat" DROP CONSTRAINT "RoomChat_secondUserId_fkey";

-- DropForeignKey
ALTER TABLE "chat" DROP CONSTRAINT "chat_roomChatId_fkey";

-- AlterTable
ALTER TABLE "chat" DROP COLUMN "roomChatId",
ADD COLUMN     "chatRoomId" BIGINT NOT NULL;

-- DropTable
DROP TABLE "RoomChat";

-- CreateTable
CREATE TABLE "ChatRoom" (
    "id" BIGSERIAL NOT NULL,
    "firstUserId" BIGINT NOT NULL,
    "secondUserId" BIGINT NOT NULL,

    CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_firstUserId_secondUserId_key" ON "ChatRoom"("firstUserId", "secondUserId");

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_firstUserId_fkey" FOREIGN KEY ("firstUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_secondUserId_fkey" FOREIGN KEY ("secondUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
