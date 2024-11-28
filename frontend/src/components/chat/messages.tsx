import { useEffect, useRef, useState } from "react";
import { ChatBubble } from "./chat-bubble";
import { ChatPayload } from "@/services/socket";

interface MessagesProps {
  messages: ChatPayload[];
  // hasNextPage?: boolean;
  // isFetchingNextPage: boolean;
  // fetchNextPage: () => void;
  // isFinished?: boolean;
  currId: string;
}

const Messages = ({
  messages,
  currId,
  // hasNextPage,
  // isFetchingNextPage,
  // fetchNextPage,
  // isFinished,
}: MessagesProps) => {
  const [lastMessageRef, setLastMessageRef] = useState<HTMLDivElement | null>(
    null
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingUp = useRef(false);

  return (
    <div
      className="no-scrollbar gap-1 flex flex-grow flex-col-reverse overflow-y-auto p-4 md:px-5 h-[calc(100vh-82.67px-83.33px)] md:h-[calc(100vh-60px-82.67px-94px)]"
      ref={containerRef}
    >
      {messages.map((msg, index) => (
        <ChatBubble
          key={index}
          timestamp={msg.timestamp.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}
          content={msg.message}
          isSent={currId === msg.fromId}
          // chatRef={index === 0 ? setLastMessageRef : null}
        />
      ))}
    </div>
  );
};

export default Messages;
