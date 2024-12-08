import Loading from "@/components/loading/loading";
import NotFound from "@/components/not-found/not-found";
import { editFeeds, getFeeds, postFeeds } from "@/services/feed";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
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
  const [editFeedId, setEditFeedId] = useState(BigInt(-1));

  const { ref, inView } = useInView({
    threshold: 0.8,
  });

  const ago: string[] = [];
  const updater: string[] = [];

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["projects"],
    queryFn: ({ pageParam = 0 }) => getFeeds({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPage) => {
      return lastPage.length > 0 ? allPage.length * 10 : undefined;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const mutationPost = useMutation({
    mutationFn: (content: string) => postFeeds(content),
    onSuccess: () => {
      console.log("Connection request sent successfully!");
    },
    onError: (error) => {
      console.error("Error sending connection request:", error);
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: ({ feedId, content }: { feedId: bigint; content: string }) =>
      editFeeds(content, feedId),
    onSuccess: () => {
      console.log("Connection request sent successfully!");
    },
    onError: (error) => {
      console.error("Error sending connection request:", error);
    },
  });

  return "Hello /feed/!";
}
