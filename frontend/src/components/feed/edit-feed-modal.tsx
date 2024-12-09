import React, { useState } from "react";

interface FeedEditorProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFeed: React.Dispatch<React.SetStateAction<string>>;
  feed: string;
  mutationUpdate: () => void;
}

export default function FeedEditor({
  setIsOpen,
  setFeed,
  feed,
  mutationUpdate,
}: FeedEditorProps) {
  const value = (event: any) => {
    setFeed(event.target.value);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
        <button
          onClick={closeModal}
          className="flex justify-end top-2 right-2 text-gray-400 hover:text-gray-900"
        >
          ✕
        </button>
        <div>
          <p className="text-2xl flex justify-center mb-[10px] font-bold">
            Edit Feed
          </p>
        </div>
        <div className="flex items-start">
          <textarea
            onChange={value}
            value={feed}
            id="feed-content"
            name="feed-content"
            placeholder="Write your feed here"
            maxLength={280}
            className="py-2 border border-solid border-black px-2 rounded-md grow h-[125px] overflow-y-auto resize-none"
          ></textarea>
        </div>
        <div className="flex justify-start">
          <p className="text-xs text-gray-400 mt-[5px] mb-[15px]">
            {feed.length}/280
          </p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={mutationUpdate}
            className="bg-blue-950 rounded-md text-white py-[5px] px-[10px] hover:bg-gray-400 hover:text-blue-950"
          >
            Edit Feed
          </button>
        </div>
      </div>
    </div>
  );
}
