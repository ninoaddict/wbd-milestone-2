import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import NotFound from "@/components/not-found/not-found";
import Loading from "@/components/loading/loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { queryOptions } from "@tanstack/react-query";
import { getChatHeaders } from "@/services/chat";
import { convertTime } from "@/lib/utils";

const chatHeadersQueryOptions = () =>
  queryOptions({
    queryKey: ["chatHeaders"],
    queryFn: () => getChatHeaders(),
  });

export const Route = createFileRoute("/chat/")({
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
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(chatHeadersQueryOptions());
  },
});

function RouteComponent() {
  const chatHeaders = Route.useLoaderData();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4f2ee] lg:pt-6">
      <div className="flex flex-col max-h-[1000px] md:max-w-screen-sm w-full h-[100vh] pt-[52.67px] md:pt-0 md:h-[calc(100vh-130px)] rounded-xl shadow-lg bg-white">
        <div className="p-4 border-b hidden md:block">
          <h2 className="text-lg font-semibold">Messaging</h2>
        </div>
        <ScrollArea className="h-full">
          <div className="p-4">
            {chatHeaders.map((chat, index) => (
              <Link key={chat.id} to={`/chat/${chat.id}`}>
                <div className="flex items-center space-x-4 cursor-pointer hover:bg-accent rounded-lg p-2 transition-colors duration-200">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={chat.profile.profile_photo_path}
                      alt={chat.profile.username}
                    />
                    <AvatarFallback>
                      {chat.profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {chat.profile.name}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {convertTime(chat.lastTimeStamp)}
                  </div>
                </div>
                {index < chatHeaders.length - 1 && (
                  <Separator className="my-2" />
                )}
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
