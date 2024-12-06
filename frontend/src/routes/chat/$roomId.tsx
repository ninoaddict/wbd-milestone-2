import { createFileRoute, redirect } from "@tanstack/react-router";
import NotFound from "@/components/not-found/not-found";
import { useAuth } from "@/context/auth-context";
import { queryOptions } from "@tanstack/react-query";
import { getChatRoomData } from "@/services/chat";
import ChatPage from "@/components/chat/chat";
import Loading from "@/components/loading/loading";

const chatRoomQueryOptions = (roomId: string) =>
  queryOptions({
    queryKey: ["matchRoom", { roomId }],
    queryFn: () => getChatRoomData(roomId),
  });

export const Route = createFileRoute("/chat/$roomId")({
  component: RouteComponent,
  errorComponent: NotFound,
  pendingComponent: Loading,
  beforeLoad: ({ context }) => {
    if (!context.auth.user) {
      throw redirect({
        to: "/login",
      });
    }
  },
  loader: ({ context: { queryClient }, params: { roomId } }) => {
    return queryClient.ensureQueryData(chatRoomQueryOptions(roomId));
  },
});

function RouteComponent() {
  const { user, loading } = useAuth();
  const chatRoomId = Route.useParams().roomId;
  const chatRoom = Route.useLoaderData();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  const fromId = user.id;
  const toId =
    user.id === chatRoom.firstUserId
      ? chatRoom.secondUserId
      : chatRoom.firstUserId;

  return <ChatPage fromId={fromId} toId={toId} roomId={chatRoomId} />;
}
