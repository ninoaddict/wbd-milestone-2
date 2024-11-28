interface ChatBubbleProps {
  content: string;
  timestamp: string;
  isSent: boolean;
  chatRef?: React.Ref<HTMLDivElement> | null;
}

export function ChatBubble({
  content,
  timestamp,
  isSent,
  chatRef,
}: ChatBubbleProps) {
  const bubbleClasses = `relative max-w-[80%] sm:max-w-[70%] lg:max-w-[65%] p-3 py-2 rounded-xl text-sm ${
    isSent
      ? "bg-blue-500 text-white self-end"
      : "bg-gray-300 text-black self-start"
  }`;

  return (
    <div
      className={`flex ${isSent ? "justify-end" : "justify-start"} mb-2`}
      ref={chatRef ?? null}
    >
      <div className={bubbleClasses}>
        <div className="text-md break-words pb-[6px]">{content}</div>
        <div
          className={`text-xs text-opacity-75 ${
            isSent ? "text-right" : "text-left"
          }`}
        >
          {timestamp}
        </div>
        <div
          className={`absolute h-0 w-0 border-[10px] ${
            isSent
              ? "bottom-0 right-0 -translate-y-1/3 translate-x-1/2 transform border-blue-500 border-r-transparent border-t-transparent"
              : "bottom-0 left-0 -translate-x-1/2 -translate-y-1/3 transform border-gray-300 border-l-transparent border-t-transparent"
          }`}
        />
      </div>
    </div>
  );
}
