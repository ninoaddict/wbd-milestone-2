import FeedEditor from "@/components/feed/edit-feed-modal";
import Loading from "@/components/loading/loading";
import NotFound from "@/components/not-found/not-found";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth-context";
import { Feed } from "@/domain/interfaces/feed.interface";
import { useToast } from "@/hooks/use-toast";
import { STORAGE_URL } from "@/lib/const";
import { convertCreatedAt, convertUpdatedAt } from "@/lib/utils";
import { deleteFeeds, editFeeds, getFeeds, postFeeds } from "@/services/feed";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { Pencil, Send, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export const Route = createFileRoute("/feed/")({
  component: RouteComponent,
  pendingComponent: Loading,
  errorComponent: NotFound,
  beforeLoad: ({ context }) => {
    if (!context.auth.user) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

function RouteComponent() {
  const [feedValue, setFeedValue] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editFeedValue, setEditFeedValue] = useState("");
  const [editFeedId, setEditFeedId] = useState("-1");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { ref, inView } = useInView({
    threshold: 0.8,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["feeds"],
      queryFn: getFeeds,
      initialPageParam: "",
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchInterval: false,
      refetchOnWindowFocus: false,
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  const openModal = (feed: string, feedId: string) => {
    setEditFeedValue(feed);
    setEditFeedId(feedId);
    setModalOpen(true);
  };

  const mutationPost = useMutation({
    mutationFn: (content: string) => postFeeds(content),
    onSuccess: (newFeed) => {
      queryClient.setQueryData(["feeds"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              feeds: [
                {
                  ...newFeed,
                  name: user?.name || "",
                  username: user?.username || "",
                  profile_photo_path: user?.profile_photo_path || "",
                },
                ...oldData.pages[0].feeds,
              ],
            },
          ],
        };
      });
      toast({
        title: "Success",
        description: "Feed posted successfully",
        className: "bg-green-500 text-white",
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast({
          title: "Post feed error",
          description:
            error.response?.data.message || "Unexpected error occured",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Post feed error",
          description: "Unexpected error occured",
          variant: "destructive",
        });
      }
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: ({ feedId, content }: { feedId: bigint; content: string }) =>
      editFeeds(content, feedId),
    onSuccess: (data) => {
      queryClient.setQueryData(["feeds"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            feeds: page.feeds.map((feed: Feed) =>
              feed.id === data.id
                ? {
                    ...data,
                    name: user?.name || "",
                    username: user?.username || "",
                    profile_photo_path: user?.profile_photo_path || "",
                  }
                : feed
            ),
          })),
        };
      });

      setModalOpen(false);
      toast({
        title: "Success",
        description: "Feed updated successfully",
        className: "bg-green-500 text-white",
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast({
          title: "Update feed error",
          description:
            error.response?.data.message || "Unexpected error occured",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Update feed error",
          description: "Unexpected error occured",
          variant: "destructive",
        });
      }
    },
  });

  const mutationDelete = useMutation({
    mutationFn: (feedId: bigint) => deleteFeeds(feedId),
    onSuccess: (data) => {
      queryClient.setQueryData(["feeds"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            feeds: page.feeds.filter((feed: Feed) => feed.id !== data.id),
          })),
        };
      });
      toast({
        title: "Success",
        description: "Feed deleted successfully",
        className: "bg-green-500 text-white",
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast({
          title: "Delete feed error",
          description:
            error.response?.data.message || "Unexpected error occured",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Delete feed error",
          description: "Unexpected error occured",
          variant: "destructive",
        });
      }
    },
  });

  // const addNewFeedState = useCallback((incoming: Feed) => {
  //   setFeedList((current) => {
  //     return [incoming, ...current];
  //   });
  // }, []);

  // const addFeedState = useCallback((incoming: Feed[]) => {
  //   setFeedList((current) => {
  //     const combinedFeeds = [...current, ...incoming];
  //     return combinedFeeds;
  //   });
  // }, []);

  // const editFeedState = useCallback((incoming: Feed) => {
  //   setFeedList((current) => {
  //     return current.map((curr) => {
  //       if (curr.id === incoming.id) {
  //         return incoming;
  //       } else {
  //         return curr;
  //       }
  //     });
  //   });
  // }, []);

  // const deleteFeedState = useCallback((incoming: Feed) => {
  //   setFeedList((current) => {
  //     return current.filter((curr) => curr.id !== incoming.id);
  //   });
  // }, []);

  // useEffect(() => {
  //   const feed = data?.pages[data.pages.length - 1].feeds || [];
  //   console.log(data?.pages.length);
  //   addFeedState(feed);
  // }, [data?.pages, addFeedState]);

  const sendFeed = (feed: string) => {
    if (feed.length > 0) {
      mutationPost.mutate(feed);
    }
  };

  const editFeed = (feedId: string, feed: string) => {
    mutationUpdate.mutate({ feedId: BigInt(feedId), content: feed });
  };

  const deleteFeed = (feedId: string) => {
    mutationDelete.mutate(BigInt(feedId));
  };

  return (
    <div className="p-2 min-h-screen bg-[#f4f2ee]">
      <main className="max-w-[1280px] mx-auto grid grid-cols-1 gap-6 px-4 pt-20 md:grid-cols-12 lg:gap-8">
        <aside className="hidden md:col-span-3 md:block">
          <Card className="shadow">
            <CardContent className="p-0 text-center pb-4">
              <div className="mx-auto h-20 rounded-t-lg">
                <img src="/banner.webp" alt="Banner" className="rounded-t-lg" />
              </div>
              <div className="-mt-3">
                <Avatar className="mx-auto mb-2 h-16 w-16 border-4 border-white">
                  <AvatarImage
                    src={
                      user?.profile_photo_path
                        ? `${STORAGE_URL}/${user?.profile_photo_path}`
                        : ""
                    }
                  />
                  <AvatarFallback>
                    {user?.name.charAt(0) || "NF"}
                  </AvatarFallback>
                </Avatar>
                <h2 className="font-semibold">{user?.name || "Not found"}</h2>
                <p className="text-sm text-gray-400">
                  @{user?.username || "Not found"}
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Main Feed */}
        <div className="md:col-span-6">
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex gap-4 items-center">
                <Avatar className="hidden sm:block">
                  <AvatarImage
                    src={
                      user?.profile_photo_path
                        ? `${STORAGE_URL}/${user?.profile_photo_path}`
                        : ""
                    }
                  />
                  <AvatarFallback>
                    {user?.name.charAt(0) || "NF"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    className="shadow border no-scrollbar resize-none w-full"
                    placeholder="Write your feed here"
                    rows={2}
                    maxLength={280}
                    onChange={(e) => setFeedValue(e.target.value)}
                    id="feed-input-content"
                    name="feed-input-content"
                  ></Textarea>
                </div>
                <Button size="icon" onClick={() => sendFeed(feedValue)}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {data?.pages.map((page) =>
              page.feeds.map((feed) => (
                <Card key={feed.id}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar>
                      <AvatarImage
                        src={
                          feed.profile_photo_path
                            ? `${STORAGE_URL}/${feed.profile_photo_path}`
                            : ""
                        }
                      />
                      <AvatarFallback>
                        {feed.name.charAt(0) || "NF"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Link
                        to={`/profile/${feed.userId}`}
                        className="hover:underline hover:text-blue-700"
                      >
                        <h3 className="font-semibold">{feed.name}</h3>
                      </Link>
                      <p className="text-sm text-gray-500">
                        <span>
                          {feed.createdAt !== feed.updatedAt
                            ? convertUpdatedAt(feed.updatedAt)
                            : convertCreatedAt(feed.createdAt)}
                        </span>
                      </p>
                    </div>
                    {feed.userId === user?.id && (
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openModal(feed.content, feed.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteFeed(feed.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p>{feed.content}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          <div className="flex justify-center items-center">
            {user && data?.pages && data.pages.length > 0 && (
              <button
                ref={ref}
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
                className="text-gray-450 py-[5px] px-[5px]"
              >
                {isFetchingNextPage
                  ? "Loading more..."
                  : hasNextPage
                    ? "Load More"
                    : ""}
              </button>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="hidden lg:col-span-3 lg:block">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">People you may know</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((connection) => (
                <div key={connection} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium">Sarah Designer</h3>
                    <p className="text-sm text-gray-500">UI/UX Designer</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </main>
      {modalOpen && (
        <FeedEditor
          setIsOpen={setModalOpen}
          setFeed={setEditFeedValue}
          feed={editFeedValue}
          mutationUpdate={() => {
            editFeed(editFeedId, editFeedValue);
          }}
        />
      )}
    </div>
  );
}
