export interface Feed {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  userId: string;
  name: string;
}

export type FeedList = Feed[];
