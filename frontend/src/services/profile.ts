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
  skills: string;
  work_history: string;
  profile_photo?: null | File;
}

export const getProfile = async (userId: string) => {
  const res = (await api
    .get(`/profile/${userId}`)
    .then((r) => r.data)
    .catch((err) => {
      if (err.status === 404) {
        throw new AxiosError("Profile not found");
      }
      throw err;
    })) as ProfileResponse;
  return res.body;
};

export const updateProfile = async (payload: UpdateProfilePayload) => {
  if (payload.profile_photo instanceof File) {
    return updateProfileWithPhoto(payload);
  }
  const res = (await api.put(`/profile/${payload.id}`, payload))
    .data as UpdateProfileResponse;
  const user = res.body;
  if (!user) {
    throw new AxiosError("Fail to update profile");
  }
  return user;
};

const updateProfileWithPhoto = async (payload: UpdateProfilePayload) => {
  const formData = new FormData();
  formData.append("username", payload.username);
  formData.append("name", payload.name);
  formData.append("skills", payload.skills);
  formData.append("work_history", payload.work_history);
  formData.append("profile_photo", payload.profile_photo!);
  const res = (
    await api.put(`/profile/${payload.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  ).data as UpdateProfileResponse;
  const user = res.body;
  if (!user) {
    throw new AxiosError("Profile updated");
  }
  return user;
};
