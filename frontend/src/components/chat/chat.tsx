import { useUser } from "@/context/auth-context";
import { ChatPayload, socket } from "@/services/socket";
import { useCallback, useEffect, useState } from "react";
import useEmit from "@/hooks/useEmit";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MoreHorizontal, Phone, Video, ChevronLeftIcon } from "lucide-react";
import { ChatBubble } from "./chat-bubble";
import useSubscription from "@/hooks/useSubscription";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/services/profile";
import { getLimitedUser } from "@/services/user";
import ChatNavbar from "./chat-navbar";
import { useRouter } from "@tanstack/react-router";
import { ChatFooter } from "./chat-footer";
import Messages from "./messages";

export default function ChatPage({
  fromId,
  toId,
}: {
  fromId: string;
  toId: string;
}) {
  const [messages, setMessages] = useState<ChatPayload[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  // get other user data
  const { data: profileData, refetch } = useQuery({
    queryKey: ["oponentProfile"],
    queryFn: () => getLimitedUser(toId),
  });

  // refetch if other user data is not available
  useEffect(() => {
    if (!profileData) {
      void refetch();
    }
  }, [profileData, refetch]);

  // add message function
  const addMessages = useCallback((incoming?: ChatPayload[]) => {
    setMessages((current) => {
      const map: Record<ChatPayload["id"], ChatPayload> = {};
      for (const msg of current ?? []) map[msg.id] = msg;
      for (const msg of incoming ?? []) map[msg.id] = msg;
      return Object.values(map).sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      );
    });
  }, []);

  // sending message
  const messageEmit = useEmit("message");
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      messageEmit.mutate({ message: newMessage.trim(), receiverId: toId });
      setNewMessage("");
      const textarea = document.querySelector("textarea");
      if (textarea) {
        textarea.style.height = "auto";
      }
    }
  };

  // receiving message
  useSubscription("addMessage", (post) => {
    if (post.chatRoomId) {
      addMessages([post]);
    }
  });

  // sending isTyping
  const isTypingEmit = useEmit("isTyping");

  // receiving isTyping
  useSubscription("whoIsTyping", () => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  });

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    isTypingEmit.mutate({ receiverId: toId });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4f2ee]">
      <div className="flex flex-col max-h-[1000px] md:max-w-screen-sm w-full h-[100vh] md:h-[calc(100vh-60px)] rounded-xl shadow-lg bg-white">
        <Card className="border-x-0 rounded-none sm:rounded-xl border-t-0">
          <CardHeader className="border-b-2 py-4 pl-3">
            <div className="flex items-center">
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-inherit"
                onClick={() => {
                  router.history.back();
                }}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={profileData?.profile_photo_path}
                    alt="Sarah Wilson"
                  />
                  <AvatarFallback>
                    {profileData?.name ? profileData?.name.charAt(0) : ""}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="font-semibold text-lg">
                    {profileData?.name ?? ""}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {isTyping
                      ? `${profileData?.name.split(" ").filter((_, id) => id === 0)} is typing...`
                      : (profileData?.username ?? "")}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Messages currId={fromId} messages={messages} />
            <ChatFooter
              newMessage={newMessage}
              handleTyping={handleTyping}
              handleSendMessage={handleSendMessage}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
