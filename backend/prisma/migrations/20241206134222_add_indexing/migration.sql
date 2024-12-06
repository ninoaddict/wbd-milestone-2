-- DropIndex
DROP INDEX "chat_timestamp_idx";

-- AlterTable
ALTER TABLE "ChatRoom" ADD COLUMN     "lastMessage" TEXT,
ADD COLUMN     "lastTimeStamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "ChatRoom_lastTimeStamp_idx" ON "ChatRoom"("lastTimeStamp" DESC);

-- CreateIndex
CREATE INDEX "chat_timestamp_idx" ON "chat"("timestamp" DESC);

-- CreateIndex
CREATE INDEX "feed_created_at_idx" ON "feed"("created_at" DESC);
