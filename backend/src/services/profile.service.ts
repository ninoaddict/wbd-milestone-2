import { User } from "@prisma/client";
import ProfileRepository from "../repositories/profile.repository";
import ConnectionRepository from "../repositories/connection.repository";
import { updateProfileDto } from "../domain/schema/profile.schema";
import NotFound from "../errors/not-found.error";

class ProfileService {
  private profileRepository: ProfileRepository;
  private connectionRepository: ConnectionRepository;
  constructor() {
    this.profileRepository = new ProfileRepository();
    this.connectionRepository = new ConnectionRepository();
  }

  getProfile = async (user: User | undefined, userId: bigint) => {
    if (!user) {
      const raw = await this.profileRepository.getProfileByPublic(userId);

      if (!raw) {
        throw new NotFound("User not found");
      }

      return {
        username: raw.username,
        name: raw.name,
        skills: raw.skills,
        profile_photo: raw.profile_photo_path,
        work_history: raw.work_history,
        connection_count: raw._count.connectionsSent,
        connection_status: "public",
      };
    } else if (user.id === userId) {
      const raw = await this.profileRepository.getSelfProfile(userId);
      if (!raw) {
        throw new NotFound("User not found");
      }
      return {
        username: raw.username,
        name: raw.name,
        skills: raw.skills,
        relevant_post: raw.feeds,
        profile_photo: raw.profile_photo_path,
        work_history: raw.work_history,
        connection_count: raw._count.connectionsSent,
        connection_status: "self",
      };
    } else if (await this.connectionRepository.isConnected(user.id, userId)) {
      const raw = await this.profileRepository.getProfileByConnectedUser(
        userId
      );
      if (!raw) {
        throw new NotFound("User not found");
      }
      return {
        username: raw.username,
        name: raw.name,
        skills: raw.skills,
        relevant_post: raw.feeds,
        profile_photo: raw.profile_photo_path,
        work_history: raw.work_history,
        connection_count: raw._count.connectionsSent,
        connection_status: "connected",
      };
    } else {
      const raw = await this.profileRepository.getProfileByUser(userId);
      if (!raw) {
        throw new NotFound("User not found");
      }
      return {
        username: raw.username,
        name: raw.name,
        skills: raw.skills,
        relevant_post: raw.feeds,
        profile_photo: raw.profile_photo_path,
        work_history: raw.work_history,
        connection_count: raw._count.connectionsSent,
        connection_status: "connected",
      };
    }
  };

  updateProfile = async (
    id: bigint,
    payload: updateProfileDto,
    profile_photo: string | undefined
  ) => {
    const profileData: ProfileData = {
      name: payload.name,
      skills: payload.skills ?? "",
      work_history: payload.work_history ?? "",
      profile_photo_path: profile_photo,
    };
    return await this.profileRepository.updateProfile(profileData, id);
  };
}

export type ProfileData = {
  name: string;
  work_history: string;
  skills: string;
  profile_photo_path: string | undefined;
};

export default ProfileService;
