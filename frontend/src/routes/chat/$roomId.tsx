import { useEffect } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import NotFound from "@/components/not-found/not-found";
import { useUser } from "@/context/auth-context";
import Loading from "@/components/loading/loading";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { getChatRoomData } from "@/services/chat";
import ChatPage from "@/components/chat/chat";
import { socket } from "@/services/socket";

const chatRoomQueryOptions = (roomId: string) =>
  queryOptions({
    queryKey: ["matchRoom", { roomId }],
    queryFn: () => getChatRoomData(roomId),
  });

export const Route = createFileRoute("/chat/$roomId")({
  component: RouteComponent,
  errorComponent: NotFound,
  loader: ({ context: { queryClient }, params: { roomId } }) => {
    return queryClient.ensureQueryData(chatRoomQueryOptions(roomId));
  },
});

function RouteComponent() {
  const chatRoomId = Route.useParams().roomId;
  const router = useRouter();
  const { user, loading } = useUser();

  // Always call hooks unconditionally
  const { data: chatRoom, isLoading: chatRoomLoading } = useQuery(
    chatRoomQueryOptions(chatRoomId)
  );

  useEffect(() => {
    if (!user && !loading) {
      router.navigate({
        to: "/login",
        replace: true,
      });
    }
  }, [user, loading, router]);

  // Conditional logic inside the render
  if (loading || chatRoomLoading) {
    return <Loading />;
  }

  if (!user) {
    return null; // Prevent rendering while navigating
  }

  if (
    !chatRoom ||
    (user.id !== chatRoom.firstUserId && user.id !== chatRoom.secondUserId)
  ) {
    return <NotFound />;
  }

  const fromId = user.id;
  const toId =
    user.id === chatRoom.firstUserId
      ? chatRoom.secondUserId
      : chatRoom.firstUserId;

  return <ChatPage fromId={fromId} toId={toId} />;
}
