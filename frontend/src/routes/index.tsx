import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/context/auth-context";
import { SendHorizonal, SquarePen, Trash2 } from "lucide-react";
import { getFeeds, postFeeds, editFeeds, deleteFeeds } from "@/services/feed";
import { Feed } from "../domain/interfaces/feed.interface";
import { useMutation } from "@tanstack/react-query";
import FeedEditor from "@/components/feed/edit-feed-modal";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import Loading from "@/components/loading/loading";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const infoUser = useAuth();

  if (!infoUser.user) {
    return (
      <div className="flex py-[100px] justify-center">
        <div className="ml-[50px] mr-[50px] xl:mr-[0px] mt-[140px] xl2:mt-[0px] justify-center items-center flex flex-col">
          <p className="text-xl sm:text-3xl lg:text-5xl font-normal flex justify-center text-center items-center">
            Welcome to your professional community
          </p>
          <a
            href="/login"
            className="text-xs sm:text-sm lg:text-md bg-blue-600 py-1 md:py-1 px-10 sm:px-20 md:px-40 rounded-3xl text-white items-center flex mt-[20px] border border-solid border-blue-600 hover:text-blue-600 hover:bg-white"
          >
            Sign in with Email
          </a>
          <p className="text-[9px] sm:text-xs font-normal flex justify-center text-center items-center mt-[20px] text-gray-400">
            By signing in or registering, you agree to LinkedPurry User
            Agreement, Privacy Policy, and Cookie Policy.
          </p>
          <p className="text-xs sm:text-sm font-normal flex justify-center text-center items-center mt-[20px] text-gray-500 space-x-1">
            <span>New to LinkedPurry?</span>
            <a href="/register" className="text-blue-600">
              Register
            </a>
            <span>here!</span>
          </p>
        </div>
        <div className="flex justify-end">
          <img
            src="/guy_working.svg"
            className="w-[100%] h-[100%] hidden xl2:block"
          ></img>
        </div>
      </div>
    );
  }

  const [feedValue, setFeedValue] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editFeedValue, setEditFeedValue] = React.useState("");
  const [editFeedId, setEditFeedId] = React.useState(BigInt(-1));

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

  React.useEffect(() => {
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

  const mutationDelete = useMutation({
    mutationFn: (feedId: bigint) => deleteFeeds(feedId),
    onSuccess: () => {
      console.log("Connection request sent successfully!");
    },
    onError: (error) => {
      console.error("Error sending connection request:", error);
    },
  });

  if (infoUser.loading) {
    return <Loading />;
  }

  if (!infoUser.user) {
    return (
      <div className="flex py-[100px] justify-center">
        <div className="ml-[50px] justify-center items-center flex flex-col">
          <p className="text-5xl font-normal flex justify-center text-center items-center">
            Welcome to your professional community
          </p>
          <a
            href="/login"
            className="text-md bg-blue-600 py-2 px-40 rounded-3xl text-white items-center flex mt-[20px] border border-solid border-blue-600 hover:text-blue-600 hover:bg-white"
          >
            Sign in with Email
          </a>
          <p className="text-xs font-normal flex justify-center text-center items-center mt-[20px] text-gray-400">
            By signing in or registering, you agree to LinkedPurry User
            Agreement, Privacy Policy, and Cookie Policy.
          </p>
          <p className="text-sm font-normal flex justify-center text-center items-center mt-[20px] text-gray-500 space-x-1">
            <span>New to LinkedPurry?</span>
            <a href="/register" className="text-blue-600">
              Register
            </a>
            <span>here!</span>
          </p>
        </div>
        <div className="flex justify-end">
          <img src="/guy_working.svg" className="w-[100%] h-[100%]"></img>
        </div>
      </div>
    );
  }

  const flatData = data?.pages.flat();

  const openModal = (feed: string, feedId: bigint) => {
    setEditFeedValue(feed);
    setEditFeedId(feedId);
    setModalOpen(true);
  };

  if (flatData) {
    for (let feed of flatData) {
      const millisec = Math.floor(
        Date.now() - new Date(feed.createdAt).getTime()
      );
      if (millisec >= 1000 * 60 && millisec < 1000 * 60 * 60) {
        ago.push(`Created ${Math.floor(millisec / (1000 * 60))} minutes ago`);
      } else if (millisec >= 1000 * 60 * 60 && millisec < 1000 * 60 * 60 * 24) {
        ago.push(
          `Created ${Math.floor(millisec / (1000 * 60 * 60))} hours ago`
        );
      } else if (
        millisec >= 1000 * 60 * 60 * 24 &&
        millisec < 1000 * 60 * 60 * 24 * 7
      ) {
        ago.push(
          `Created ${Math.floor(millisec / (1000 * 60 * 60 * 24))} days ago`
        );
      } else if (
        millisec >= 1000 * 60 * 60 * 24 * 7 &&
        millisec < 1000 * 60 * 60 * 24 * 30
      ) {
        ago.push(
          `Created ${Math.floor(millisec / (1000 * 60 * 60 * 24 * 7))} weeks ago`
        );
      } else if (
        millisec >= 1000 * 60 * 60 * 24 * 30 &&
        millisec < 1000 * 60 * 60 * 24 * 365
      ) {
        ago.push(
          `Created ${Math.floor(millisec / (1000 * 60 * 60 * 24 * 30))} months ago`
        );
      } else if (millisec >= 1000 * 60 * 60 * 24 * 365) {
        ago.push(
          `Created ${Math.floor(millisec / (1000 * 60 * 60 * 24 * 365))} years ago`
        );
      } else {
        ago.push(`Created ${Math.floor(millisec / 1000)} seconds ago`);
      }
    }
  }

  if (flatData) {
    for (let feed of flatData) {
      const millisec = Math.floor(
        Date.now() - new Date(feed.updatedAt).getTime()
      );
      if (millisec >= 1000 * 60 && millisec < 1000 * 60 * 60) {
        updater.push(
          `Last updated ${Math.floor(millisec / (1000 * 60))} minutes ago`
        );
      } else if (millisec >= 1000 * 60 * 60 && millisec < 1000 * 60 * 60 * 24) {
        updater.push(
          `Last updated ${Math.floor(millisec / (1000 * 60 * 60))} hours ago`
        );
      } else if (
        millisec >= 1000 * 60 * 60 * 24 &&
        millisec < 1000 * 60 * 60 * 24 * 7
      ) {
        updater.push(
          `Last updated ${Math.floor(millisec / (1000 * 60 * 60 * 24))} days ago`
        );
      } else if (
        millisec >= 1000 * 60 * 60 * 24 * 7 &&
        millisec < 1000 * 60 * 60 * 24 * 30
      ) {
        updater.push(
          `Last updated ${Math.floor(millisec / (1000 * 60 * 60 * 24 * 7))} weeks ago`
        );
      } else if (
        millisec >= 1000 * 60 * 60 * 24 * 30 &&
        millisec < 1000 * 60 * 60 * 24 * 365
      ) {
        updater.push(
          `Last updated ${Math.floor(millisec / (1000 * 60 * 60 * 24 * 30))} months ago`
        );
      } else if (millisec >= 1000 * 60 * 60 * 24 * 365) {
        updater.push(
          `Last updated ${Math.floor(millisec / (1000 * 60 * 60 * 24 * 365))} years ago`
        );
      } else {
        updater.push(`Last updated ${Math.floor(millisec / 1000)} seconds ago`);
      }
    }
  }

  function feedPage(feed: Feed, ago: string, updater: string) {
    return (
      <div className="bg-white border border-solid border-gray-300 w-[350px] md:w-[600px] h-100 flex flex-col justify-start items-start rounded-md py-3 px-5 mb-[10px] shadow-md">
        <header className="flex flex-row mb-[10px] w-full">
          <img
            src="/placeholder.png"
            className="object-cover w-[50px] h-[50px] flex justify-center"
          ></img>
          <div className="flex grow justify-between">
            <a
              href={`profile/${feed.userId}`}
              className="flex items-center justify-center ml-[5px]"
            >
              {feed.name}
            </a>
            {feed.userId === infoUser.user?.id && (
              <div className="flex justify-end items-center">
                <SquarePen
                  onClick={() => openModal(feed.content, BigInt(feed.id))}
                  className="mr-[5px] ml-[10px] cursor-pointer hover:bg-gray-200"
                />
                <Trash2
                  onClick={() => {
                    deleteFeed(BigInt(feed.id));
                    window.location.reload();
                  }}
                  className="mr-[5px] ml-[10px] cursor-pointer hover:bg-gray-200"
                />
              </div>
            )}
          </div>
        </header>
        <main>
          <p>{feed.content}</p>
        </main>
        <footer className="text-xs text-gray-400 mt-[5px]">
          <p>
            {ago} | {updater}
          </p>
        </footer>
      </div>
    );
  }

  const value = (e: any) => {
    setFeedValue(e.target.value);
  };

  const sendFeed = (feed: string) => {
    if (feed.length > 0) {
      mutationPost.mutate(feed);
      window.location.reload();
    }
  };

  const editFeed = (feedId: bigint, feed: string) => {
    mutationUpdate.mutate({ feedId: feedId, content: feed });
  };

  const deleteFeed = (feedId: bigint) => {
    mutationDelete.mutate(feedId);
  };

  return (
    <div className="p-2 min-h-screen bg-[#f4f2ee]">
      <h3>Welcome Home!</h3>
      <main className="mt-[100px] flex flex-col xl:flex-row justify-center items-center xl:items-start">
        <section id="profile" className="ml-[10px] mr-[10px] mb-[20px]">
          <div className="shadow-md bg-white border border-solid border-gray-300 w-100 h-100 flex flex-col justify-center items-center rounded-md">
            <img
              src="/banner.jpeg"
              className="object-cover xl:w-[300px] xl:h-[150px] md:w-[600px] w-[350px] flex justify-center rounded-t-md"
            ></img>
            <a
              href={`profile/${infoUser.user?.id}`}
              className="text-center mt-[10px]"
            >
              {infoUser.user?.name}
            </a>
            <p className="text-center text-gray-400 text-xs mb-[10px]">
              Skills: {infoUser.user?.skills}
            </p>
          </div>
        </section>
        <section id="feed" className="ml-[10px] mr-[10px]">
          <div className="shadow-md bg-white border border-solid border-gray-300 w-[350px] justify-center items-center md:w-[600px] h-100 flex flex-col md:justify-start md:items-start rounded-md py-3 px-5 mb-[10px]">
            <main className="flex flex-row justify-space-between items-center w-full">
              <input
                type="text"
                onChange={value}
                id="feed-content"
                name="feed-content"
                placeholder="Write your feed here"
                maxLength={280}
                className="py-2 focus:outline-none focus:border-none grow mr-[10px]"
              ></input>
              <SendHorizonal
                className="hover:cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  sendFeed(feedValue);
                }}
              />
            </main>
          </div>
          <div>
            {infoUser.user &&
              flatData &&
              flatData.map((item, index) => (
                <div key={index}>
                  {feedPage(item, ago[index], updater[index])}
                </div>
              ))}
          </div>
          <div className="flex justify-center items-center">
            {infoUser.user && flatData && flatData.length > 0 && (
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
        </section>
        {/* <section id="connections" className="ml-[10px] mr-[10px]">
          <div className="bg-white border border-solid border-gray-300 w-100 h-100 flex flex-col justify-center items-center rounded-md">
            <img
              src="/placeholder.png"
              className="object-cover w-[250px] h-[150px] flex justify-center"
            ></img>
            <p className="text-center mt-[10px]">{infoUser.user?.name}</p>
            <p className="text-center text-gray-400 text-xs mb-[10px]">Skills: {infoUser.user?.skills}</p>
          </div>
        </section> */}
      </main>
      {modalOpen && (
        <FeedEditor
          setIsOpen={setModalOpen}
          setFeed={setEditFeedValue}
          feed={editFeedValue}
          mutationUpdate={() => {
            editFeed(editFeedId, editFeedValue);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
