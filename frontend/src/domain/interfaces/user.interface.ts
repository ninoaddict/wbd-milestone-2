import { Feed } from "./feed.interface";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  work_history: string;
  skills: string;
  profile_photo_path: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  username: string;
  name: string;
  skills: string;
  profile_photo: string;
  work_history: string;
  connection_count: number;
  connection_status: string;
  relevant_post: Feed[] | null | undefined;
}

export interface LimitedUser {
  id: string;
  name: string;
  username: string;
  profile_photo_path: string;
}
