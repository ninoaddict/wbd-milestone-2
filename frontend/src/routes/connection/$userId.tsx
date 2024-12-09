import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";
import { getConnectionsList } from "@/services/userList";
import NotFound from "@/components/not-found/not-found";
import Loading from "@/components/loading/loading";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { STORAGE_URL } from "@/lib/const";

const connectionListQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["connectionList", { userId }],
    queryFn: () => getConnectionsList(userId),
  });

export const Route = createFileRoute("/connection/$userId")({
  component: RouteComponent,
  errorComponent: NotFound,
  pendingComponent: Loading,
  loader: ({ context: { queryClient }, params: { userId } }) => {
    return queryClient.ensureQueryData(connectionListQueryOptions(userId));
  },
});

function RouteComponent() {
  const userList = Route.useLoaderData();
  return (
    <div className="min-h-screen w-full bg-[#f4f2ee]">
      <main className="mx-auto max-w-2xl px-4 py-8 pt-[80px]">
        <h1 className="mb-3 text-xl ">
          {userList ? userList.length : 0}{" "}
          {userList?.length === 1 ? "Connected User" : "Connected Users"}
        </h1>
        <Card className="shadow rounded-xl">
          <CardContent>
            {userList?.length === 0 ? (
              <p className="text-center text-muted-foreground mt-5">
                Users not found
              </p>
            ) : (
              <ul className="space-y-4">
                {userList &&
                  userList.map((item, index) => (
                    <li key={item.user.id}>
                      {index !== 0 && <Separator className="h-0.5" />}
                      <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage
                              src={
                                item.user.profile_photo_path
                                  ? `${STORAGE_URL}/${item.user.profile_photo_path}`
                                  : ""
                              }
                              alt={item.user.name}
                            />
                            <AvatarFallback>
                              {item.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <a
                              href={`/profile/${item.user.id}`}
                              className="text-lg font-medium hover:underline text-blue-700"
                            >
                              {item.user.name}
                            </a>
                            <p className="text-sm text-muted-foreground">
                              @{item.user.username}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
