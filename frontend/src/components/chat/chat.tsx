import { ChatPayload } from "@/services/socket";
import { useCallback, useEffect, useState } from "react";
import useEmit from "@/hooks/useEmit";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronLeftIcon } from "lucide-react";
import useSubscription from "@/hooks/useSubscription";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getLimitedUser } from "@/services/user";
import { useRouter } from "@tanstack/react-router";
import { ChatFooter } from "./chat-footer";
import Messages from "./messages";
import { api } from "@/lib/api";
import { MessagesData, MessagesResponse } from "@/services/chat";
import { STORAGE_URL } from "@/lib/const";
import Loading from "../loading/loading";

export default function ChatPage({
  fromId,
  toId,
  roomId,
}: {
  fromId: string;
  toId: string;
  roomId: string;
}) {
  const [messages, setMessages] = useState<ChatPayload[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();

  const getMessages = async ({
    pageParam,
  }: {
    pageParam: string | undefined;
  }) => {
    const res = (
      await api.get(`/chat/${roomId}?${pageParam ? `cursor=${pageParam}` : ""}`)
    ).data as MessagesResponse;

    const parsedMessages = res.body.messages.map((message) => ({
      ...message,
      timestamp: new Date(message.timestamp),
    }));

    return {
      messages: parsedMessages,
      nextCursor: res.body.nextCursor,
    } as MessagesData;
  };

  const joinEmit = useEmit("joinRoom");
  const leaveEmit = useEmit("leaveRoom");

  useEffect(() => {
    joinEmit.mutate(
      { roomId },
      {
        onError: (error) => console.error("Failed to join room:", error),
      }
    );
    return () => {
      leaveEmit.mutate(
        { roomId },
        {
          onError: (error) => console.error("Failed to leave room:", error),
        }
      );
    };
  }, [roomId]);

  // get other user data
  const {
    data: profileData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["opponentProfile", { toId }],
    queryFn: () => getLimitedUser(toId),
  });

  // refetch if other user data is not available
  useEffect(() => {
    if (!profileData) {
      void refetch();
    }
  }, [profileData, refetch]);

  const messageQuery = useInfiniteQuery({
    queryKey: ["messages", { roomId }],
    queryFn: getMessages,
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = messageQuery;

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

  useEffect(() => {
    const msgs = messageQuery.data?.pages.map((page) => page.messages).flat();
    addMessages(msgs);
  }, [messageQuery.data?.pages, addMessages]);

  // sending message
  const messageEmit = useEmit("message");
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      messageEmit.mutate({ message: newMessage.trim(), receiverId: roomId });
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
  useSubscription("whoIsTyping", (data) => {
    if (data !== fromId) {
      setIsTyping(true);
    }
    setTimeout(() => setIsTyping(false), 2000);
  });

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    isTypingEmit.mutate({ roomId });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center pt-[52.67px] md:pt-0 md:justify-center bg-[#f4f2ee] lg:pt-6">
      <div className="flex flex-col max-h-[1000px] md:max-w-screen-md w-full h-[calc(100vh-52.67px)] md:h-[calc(100vh-130px)] rounded-xl shadow-lg bg-white">
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
                    src={
                      profileData?.profile_photo_path
                        ? `${STORAGE_URL}/${profileData.profile_photo_path}`
                        : ""
                    }
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
                      : profileData?.username
                        ? `@${profileData.username}`
                        : ""}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Messages
              currId={fromId}
              messages={messages}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
            />
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
