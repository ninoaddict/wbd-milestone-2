import React, { useState } from "react";
import { MoveLeft } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

const ChatNavbar = ({
  isTyping = false,
  opponentId,
  name,
  profilePhoto,
}: {
  opponentId?: string | null;
  isTyping?: boolean;
  name: string | null;
  profilePhoto: string | null;
}) => {
  const router = useRouter();

  return (
    <div className="relative">
      <div className="fixed top-4 z-20 flex w-full max-w-md flex-row items-center justify-between gap-x-2 px-8">
        <div className="flex w-full items-center gap-x-2 rounded-full bg-blue-600 py-2 pl-4 pr-12 text-white">
          <div className="rounded-full bg-white p-1 text-blue-600">
            <MoveLeft
              className="h-4 w-4"
              onClick={() => router.history.back()}
            />
          </div>
          <img
            src={
              profilePhoto != null && profilePhoto !== ""
                ? profilePhoto
                : "/profile_photo_placeholder.webp"
            }
            alt="Photo Profile"
            width={32}
            height={32}
          />
          <div className="flex flex-col overflow-hidden">
            <h1 className="max-w-[140px] truncate text-[20px] font-medium">
              {name ?? "Anonymous"}
            </h1>
            {isTyping && (
              <p className="text-xs text-neutral-200">is typing...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatNavbar;
