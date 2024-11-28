import { SendHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
export const ChatFooter = ({
  newMessage,
  handleTyping,
  handleSendMessage,
}: {
  newMessage: string;
  handleTyping: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSendMessage: () => void;
}) => {
  return (
    <div className="px-4 md:px-6">
      <div className="border-t-2 px-0 md:px-6 py-2 md:py-4 flex gap-4 bg-background items-center">
        <Textarea
          placeholder="Write a message..."
          rows={2}
          className="resize-none shadow-md no-scrollbar"
          value={newMessage}
          onChange={handleTyping}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button onClick={handleSendMessage}>
          <SendHorizontal className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  );
};
