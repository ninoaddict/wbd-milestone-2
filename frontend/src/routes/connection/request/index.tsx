import Loading from "@/components/loading/loading";
import NotFound from "@/components/not-found/not-found";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { STORAGE_URL } from "@/lib/const";
import { acceptConnection, rejectConnection } from "@/services/connection";
import { getRequestsList } from "@/services/userList";
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { AxiosError } from "axios";

const connectionListQueryOptions = () =>
  queryOptions({
    queryKey: ["connectionList"],
    queryFn: () => getRequestsList(),
  });

export const Route = createFileRoute("/connection/request/")({
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
});

function RouteComponent() {
  const { toast } = useToast();
  const { data: userList } = useQuery(connectionListQueryOptions());
  const queryClient = useQueryClient();

  const mutationAccept = useMutation({
    mutationFn: (userId: bigint) => acceptConnection(userId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Connection accepted",
        className: "bg-green-500 text-white",
      });
      queryClient.refetchQueries({
        queryKey: ["connectionList"],
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast({
          title: "Error",
          description:
            error.response?.data.message || "Unexpected error occured",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Update profile error",
          description: "Unexpected error occured",
          variant: "destructive",
        });
      }
    },
  });

  const mutationReject = useMutation({
    mutationFn: (userId: bigint) => rejectConnection(userId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Connection rejected",
        className: "bg-green-500 text-white",
      });
      queryClient.refetchQueries({
        queryKey: ["connectionList"],
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast({
          title: "Error",
          description:
            error.response?.data.message || "Unexpected error occured",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Unexpected error occured",
          variant: "destructive",
        });
      }
    },
  });

  const handleAccept = async (userId: bigint) => {
    mutationAccept.mutate(BigInt(userId));
  };

  const handleIgnore = async (userId: bigint) => {
    mutationReject.mutate(BigInt(userId));
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f2ee]">
      <main className="mx-auto max-w-2xl px-4 py-8 pt-[80px]">
        <h1 className="mb-3 text-xl ">
          {userList ? userList.length : 0}{" "}
          {userList?.length === 1 ? "Request" : "Requests"}
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
                            <Link
                              to={`/profile/${item.user.id}`}
                              className="text-lg font-medium hover:underline text-blue-700"
                            >
                              {item.user.name}
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              @{item.user.username}
                            </p>
                          </div>
                        </div>
                        <div className="w-full sm:w-auto">
                          <div className="flex items-center justify-center sm:justify-normal sm:space-x-2 w-full sm:w-auto gap-2 sm:gap-0">
                            <Button
                              size="sm"
                              className="w-full sm:w-auto bg-white border border-red-700 border-solid rounded-2xl text-red-700 hover:text-white hover:bg-red-700"
                              onClick={() => handleIgnore(item.user.id)}
                            >
                              Ignore
                            </Button>
                            <Button
                              size="sm"
                              className="w-full sm:w-auto bg-white border border-blue-700 border-solid rounded-2xl text-blue-700 hover:text-white hover:bg-blue-700"
                              onClick={() => handleAccept(item.user.id)}
                            >
                              Accept
                            </Button>
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
