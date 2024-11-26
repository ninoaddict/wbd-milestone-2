import { api } from "@/lib/api";
import { Profile, User } from "@/domain/interfaces/user.interface";
import { AxiosError } from "axios";

interface ProfileResponse {
  body: Profile;
  message: string;
}

interface UpdateProfileResponse {
  body: User;
  message: string;
}

export interface UpdateProfilePayload {
  id: string;
  username: string;
  name: string;
}

export const getProfile = async (userId: string) => {
  const res = (await api
    .get(`/profile/${userId}`)
    .then((r) => r.data)
    .catch((err) => {
      if (err.status === 404) {
        throw new Error("Profile not found");
      }
      throw err;
    })) as ProfileResponse;
  return res.body;
};

export const updateProfile = async (payload: UpdateProfilePayload) => {
  const res = (await api.put(`/profile/${payload.id}`, payload))
    .data as UpdateProfileResponse;
  const user = res.body;
  if (!user) {
    throw new AxiosError("Profile updated");
  }
  return user;
};
