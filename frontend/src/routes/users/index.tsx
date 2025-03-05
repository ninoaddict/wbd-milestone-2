import Loading from "@/components/loading/loading";
import NotFound from "@/components/not-found/not-found";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ConnectionButton } from "@/components/users/connection-button";
import { useToast } from "@/hooks/use-toast";
import { STORAGE_URL } from "@/lib/const";
import {
  acceptConnection,
  deleteConnection,
  rejectConnection,
  sendConnectionReq,
} from "@/services/connection";
import { getUserList } from "@/services/userList";
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

const userListQueryOptions = (query: string) =>
  queryOptions({
    queryKey: ["userList", { query }],
    queryFn: () => getUserList(query),
  });

export const Route = createFileRoute("/users/")({
  component: RouteComponent,
  errorComponent: NotFound,
  pendingComponent: Loading,
  validateSearch: (search) => {
    return {
      query: (search.query as string) || "",
    };
  },
});

function RouteComponent() {
  const searchParams = Route.useSearch();
  const [query, setQuery] = useState(searchParams.query);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const { toast } = useToast();
  const { data: userList, isLoading } = useQuery(
    userListQueryOptions(debouncedQuery)
  );
  const router = useRouter();
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
        queryKey: ["userList", { query }],
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

  const mutationReject = useMutation({
    mutationFn: (userId: bigint) => rejectConnection(userId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Connection rejected",
        className: "bg-green-500 text-white",
      });
      queryClient.refetchQueries({
        queryKey: ["userList", { query }],
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

  const mutationDelete = useMutation({
    mutationFn: (userId: bigint) => deleteConnection(userId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Connection deleted",
        className: "bg-green-500 text-white",
      });
      queryClient.refetchQueries({
        queryKey: ["userList", { query }],
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

  const mutationSend = useMutation({
    mutationFn: (userId: bigint) => sendConnectionReq(userId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Connection sent",
        className: "bg-green-500 text-white",
      });
      queryClient.refetchQueries({
        queryKey: ["userList", { query }],
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

  const handleDelete = async (userId: bigint) => {
    mutationDelete.mutate(BigInt(userId));
  };

  const handleSend = async (userId: bigint) => {
    mutationSend.mutate(BigInt(userId));
  };

  const handleQuery = (e: any) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      if (query) {
        router.history.replace(`/users?query=${query}`);
      } else {
        router.history.replace("/users");
      }
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-[#f4f2ee]">
      <main className="container mx-auto py-8 px-4 pt-[70px] lg:pt-[80px]">
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
          <Input
            type="text"
            placeholder="Search accounts here"
            value={query}
            onChange={handleQuery}
            className="w-full bg-white text-sm sm:text-base shadow px-4 py-4 sm:py-6 rounded-xl sm:mt-3"
          />
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
                      <li key={item.id}>
                        {index !== 0 && <Separator className="h-0.5" />}
                        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage
                                src={
                                  item.profile_photo_path
                                    ? `${STORAGE_URL}/${item.profile_photo_path}`
                                    : ""
                                }
                                alt={item.name}
                              />
                              <AvatarFallback>
                                {item.name && item.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <Link
                                to={`/profile/${item.id}`}
                                className="text-lg font-medium hover:underline text-blue-700"
                              >
                                {item.name}
                              </Link>
                              <p className="text-sm text-muted-foreground">
                                @{item.username}
                              </p>
                            </div>
                          </div>
                          <div className="w-full sm:w-auto">
                            <ConnectionButton
                              info={item}
                              onSend={handleSend}
                              onIgnore={handleIgnore}
                              onAccept={handleAccept}
                              onDelete={handleDelete}
                            />
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
