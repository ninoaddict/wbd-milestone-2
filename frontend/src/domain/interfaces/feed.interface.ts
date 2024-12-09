export interface Feed {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  userId: string;
  name: string;
  username: string;
  profile_photo_path: string;
}

export interface RawFeed {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  userId: string;
}

export type FeedList = Feed[];
