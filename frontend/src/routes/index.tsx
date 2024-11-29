import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "@/context/auth-context";
import { SendHorizonal, SquarePen, Trash2 } from "lucide-react";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { getFeeds, postFeeds, editFeeds, deleteFeeds } from "@/services/feed";
import { Feed } from "../domain/interfaces/feed.interface"
import { useMutation } from "@tanstack/react-query";
import FeedEditor from "@/components/feed/edit-feed-modal";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

const feedQueryOptions = () =>
  queryOptions({
    queryKey: ["feed"],
    queryFn: () => getFeeds(),
  });

function HomeComponent() {
  const infoUser = useUser();
  const [feedValue, setFeedValue] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editFeedValue, setEditFeedValue] = React.useState("");
  const [editFeedId, setEditFeedId] = React.useState(BigInt(-1));

  const { data: feeds } = useQuery(feedQueryOptions());

  const ago: string[] = [];
  const updater: string[] = [];

  const openModal = (feed: string, feedId: bigint) => {
    setEditFeedValue(feed);
    setEditFeedId(feedId);
    setModalOpen(true);
  }

  const mutationPost = useMutation({
    mutationFn: (content: string) => postFeeds(content),
    onSuccess: () => {
      console.log('Connection request sent successfully!');
    },
    onError: (error) => {
      console.error('Error sending connection request:', error);
    }
  });

  const mutationUpdate = useMutation({
    mutationFn: ({ feedId, content }: { feedId: bigint; content: string }) => editFeeds(content, feedId),
    onSuccess: () => {
      console.log('Connection request sent successfully!');
    },
    onError: (error) => {
      console.error('Error sending connection request:', error);
    }
  });

  const mutationDelete = useMutation({
    mutationFn: (feedId: bigint) => deleteFeeds(feedId),
    onSuccess: () => {
      console.log('Connection request sent successfully!');
    },
    onError: (error) => {
      console.error('Error sending connection request:', error);
    }
  });

  if (feeds) {
    for (let feed of feeds) {
      const millisec = Math.floor((Date.now() - new Date(feed.createdAt).getTime()));
      if (millisec >= 1000*60 && millisec < 1000*60*60) {
        ago.push(`Created ${Math.floor(millisec/(1000*60))} minutes ago`);
      } else if (millisec >= 1000*60*60 && millisec < 1000*60*60*24) {
        ago.push(`Created ${Math.floor(millisec/(1000*60*60))} hours ago`);
      } else if (millisec >= 1000*60*60*24 && millisec < 1000*60*60*24*7) {
        ago.push(`Created ${Math.floor(millisec/(1000*60*60*24))} days ago`);
      } else if (millisec >= 1000*60*60*24*7 && millisec < 1000*60*60*24*30) {
        ago.push(`Created ${Math.floor(millisec/(1000*60*60*24*7))} weeks ago`);
      } else if (millisec >= 1000*60*60*24*30 && millisec < 1000*60*60*24*365) {
        ago.push(`Created ${Math.floor(millisec/(1000*60*60*24*30))} months ago`);
      } else if (millisec >= 1000*60*60*24*365) {
        ago.push(`Created ${Math.floor(millisec/(1000*60*60*24*365))} years ago`);
      } else {
        ago.push(`Created ${Math.floor(millisec/(1000))} seconds ago`);
      }
    }
  }

  if (feeds) {
    for (let feed of feeds) {
      const millisec = Math.floor((Date.now() - new Date(feed.updatedAt).getTime()));
      if (millisec >= 1000*60 && millisec < 1000*60*60) {
        updater.push(`Last updated ${Math.floor(millisec/(1000*60))} minutes ago`);
      } else if (millisec >= 1000*60*60 && millisec < 1000*60*60*24) {
        updater.push(`Last updated ${Math.floor(millisec/(1000*60*60))} hours ago`);
      } else if (millisec >= 1000*60*60*24 && millisec < 1000*60*60*24*7) {
        updater.push(`Last updated ${Math.floor(millisec/(1000*60*60*24))} days ago`);
      } else if (millisec >= 1000*60*60*24*7 && millisec < 1000*60*60*24*30) {
        updater.push(`Last updated ${Math.floor(millisec/(1000*60*60*24*7))} weeks ago`);
      } else if (millisec >= 1000*60*60*24*30 && millisec < 1000*60*60*24*365) {
        updater.push(`Last updated ${Math.floor(millisec/(1000*60*60*24*30))} months ago`);
      } else if (millisec >= 1000*60*60*24*365) {
        updater.push(`Last updated ${Math.floor(millisec/(1000*60*60*24*365))} years ago`);
      } else {
        updater.push(`Last updated ${Math.floor(millisec/(1000))} seconds ago`);
      }
    }
  }

  function feedPage(feed: Feed, ago: string, updater: string) {
    return (
      <div className="bg-white border border-solid border-gray-300 w-[600px] h-100 flex flex-col justify-start items-start rounded-md py-3 px-5 mb-[10px]">
        <header className="flex flex-row mb-[10px] w-full">
          <img
            src="/placeholder.png"
            className="object-cover w-[50px] h-[50px] flex justify-center"
          ></img>
          <div className="flex grow justify-between">
            <a href={`profile/${feed.userId}`} className="flex items-center justify-center ml-[5px]">{feed.name}</a>
            {feed.userId === infoUser.user?.id &&
            <div className="flex justify-end items-center">
              <SquarePen onClick={() => openModal(feed.content, BigInt(feed.id))} className="mr-[5px] ml-[10px] cursor-pointer hover:bg-gray-200"/>
              <Trash2 onClick={() => {deleteFeed(BigInt(feed.id)); window.location.reload()}} className="mr-[5px] ml-[10px] cursor-pointer hover:bg-gray-200"/>
            </div>
            }
          </div>
        </header>
        <main>
          <p>{feed.content}</p>
        </main>
        <footer className="text-xs text-gray-400 mt-[5px]">
          <p>{ago} | {updater}</p>
        </footer>
      </div>
    )
  }

  const value = (e: any) => {
    setFeedValue(e.target.value);
  };

  const sendFeed = (feed: string) => {
    mutationPost.mutate(feed);
  }

  const editFeed = (feedId: bigint, feed: string) => {
    mutationUpdate.mutate({feedId: feedId, content: feed});
  }

  const deleteFeed = (feedId: bigint) => {
    mutationDelete.mutate(feedId);
  }

  // console.log(ago,feeds);

  return (
    <div className="p-2 min-h-screen bg-[#f4f2ee]">
      <h3>Welcome Home!</h3>
      <main className="flex mt-[100px] flex flex-row justify-center">
        <section id="profile" className="ml-[10px] mr-[10px]">
          <div className="bg-white border border-solid border-gray-300 w-100 h-100 flex flex-col justify-center items-center rounded-md">
            <img
              src="/banner.jpeg"
              className="object-cover w-[250px] h-[150px] flex justify-center rounded-t-md"
            ></img>
            <a href={`profile/${infoUser.user?.id}`} className="text-center mt-[10px]">{infoUser.user?.name}</a>
            <p className="text-center text-gray-400 text-xs mb-[10px]">Skills: {infoUser.user?.skills}</p>
          </div>
        </section>
        <section id="feed" className="ml-[10px] mr-[10px]">
          <div className="bg-white border border-solid border-gray-300 w-[600px] h-100 flex flex-col justify-start items-start rounded-md py-3 px-5 mb-[10px]">
            <main className="flex flex-row justify-space-between items-center w-full">
              <input type="text" onChange={value} id="feed-content" name="feed-content" placeholder="Write your feed here" maxLength={280} className="py-2 focus:outline-none focus:border-none grow mr-[10px]"></input>
              <SendHorizonal className="hover:cursor-pointer hover:bg-gray-200" onClick={() => {sendFeed(feedValue); window.location.reload()}}/>
            </main>
          </div>
          <div>
            {feeds && feeds.map((item, index) => (
              <div key={index}>
                {feedPage(item, ago[index], updater[index])}
              </div>
            ))}
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
      {modalOpen && <FeedEditor setIsOpen={setModalOpen} setFeed={setEditFeedValue} feed={editFeedValue} mutationUpdate={() => {editFeed(editFeedId, editFeedValue); window.location.reload()}}/>}
    </div>
  );
}
