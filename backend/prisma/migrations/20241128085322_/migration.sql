/*
  Warnings:

  - Added the required column `roomChatId` to the `chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "chat" ADD COLUMN     "roomChatId" BIGINT NOT NULL;

-- CreateTable
CREATE TABLE "RoomChat" (
    "id" BIGSERIAL NOT NULL,
    "firstUserId" BIGINT NOT NULL,
    "secondUserId" BIGINT NOT NULL,

    CONSTRAINT "RoomChat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoomChat_firstUserId_secondUserId_key" ON "RoomChat"("firstUserId", "secondUserId");

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_roomChatId_fkey" FOREIGN KEY ("roomChatId") REFERENCES "RoomChat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomChat" ADD CONSTRAINT "RoomChat_firstUserId_fkey" FOREIGN KEY ("firstUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomChat" ADD CONSTRAINT "RoomChat_secondUserId_fkey" FOREIGN KEY ("secondUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
