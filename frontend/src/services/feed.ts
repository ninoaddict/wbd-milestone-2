import { api } from "@/lib/api";
import { Feed, FeedList } from "@/domain/interfaces/feed.interface";

interface FeedListResponse {
  body: FeedList;
  message: string;
}

export const getFeeds = async ({ pageParam }: {pageParam: number}) => {
  if (pageParam === 0 || !pageParam) {
    const res = (await api
      .get(`/feed?limit=${10}`)
      .then((r) => r.data)
      .catch((err) => {
        if (err.status === 404) {
          throw new Error("Failed to fetch the feeds");
        }
        throw err;
      })) as FeedListResponse;
      return res.body;
  } else {
    const res = (await api
      .get(`/feed?cursor=${pageParam}&limit=${10}`)
      .then((r) => r.data)
      .catch((err) => {
        if (err.status === 404) {
          throw new Error("Failed to fetch the feeds");
        }
        throw err;
    })) as FeedListResponse;
    return res.body;
  }
};

export const getMyFeeds = async (userId: bigint) => {
  const res = (await api
    .get(`/feed/${userId}`)
    .then((r) => r.data)
    .catch((err) => {
      if (err.status === 404) {
        throw new Error("Failed to fetch the feeds");
      }
      throw err;
    })) as FeedListResponse;
    return res.body;
}

export const postFeeds = async (feed: string) => {
  const formData = new FormData();
  formData.append("content", feed);
  const res = (await api
    .post(`/feed`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((r) => r.data)
    .catch((err) => {
      if (err.status === 404) {
        throw new Error("Failed to post the feeds");
      }
      throw err;
    })) as FeedListResponse;
  return res.body;
}

export const editFeeds = async (feed: string, feedId: bigint) => {
  const formData = new FormData();
  formData.append("content", feed);
  const res = (await api
    .put(`/feed/${feedId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((r) => r.data)
    .catch((err) => {
      if (err.status === 404) {
        throw new Error("Failed to edit the feeds");
      }
      throw err;
    })) as FeedListResponse;
  return res.body;
}

export const deleteFeeds = async (feedId: bigint) => {
  const res = (await api
    .delete(`/feed/${feedId}`)
    .then((r) => r.data)
    .catch((err) => {
      if (err.status === 404) {
        throw new Error("Failed to edit the feeds");
      }
      throw err;
    })) as FeedListResponse;
  return res.body;
}