-- DropForeignKey
ALTER TABLE "chat" DROP CONSTRAINT "chat_roomChatId_fkey";

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_roomChatId_fkey" FOREIGN KEY ("roomChatId") REFERENCES "RoomChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
