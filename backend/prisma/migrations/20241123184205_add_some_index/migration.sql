-- CreateIndex
CREATE INDEX "chat_timestamp_idx" ON "chat"("timestamp");

-- CreateIndex
CREATE INDEX "connection_created_at_idx" ON "connection"("created_at");

-- CreateIndex
CREATE INDEX "connection_request_created_at_idx" ON "connection_request"("created_at");
