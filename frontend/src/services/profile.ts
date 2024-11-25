import { api } from "@/lib/api";
import { Profile } from "@/domain/interfaces/user.interface";

interface ProfileResponse {
  body: Profile;
  message: string;
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
