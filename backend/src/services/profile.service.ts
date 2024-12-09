import ProfileRepository from "../repositories/profile.repository";
import ConnectionRepository from "../repositories/connection.repository";
import { updateProfileDto } from "../domain/schema/profile.schema";
import NotFound from "../errors/not-found.error";
import UserRepository from "../repositories/user.repository";
import { unlink } from "fs";

class ProfileService {
  private profileRepository: ProfileRepository;
  private connectionRepository: ConnectionRepository;
  private userRepository: UserRepository;
  constructor() {
    this.profileRepository = new ProfileRepository();
    this.connectionRepository = new ConnectionRepository();
    this.userRepository = new UserRepository();
  }

  getProfile = async (myUserID: bigint | undefined | null, userId: bigint) => {
    if (!myUserID) {
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
    } else {
      const raw = await this.profileRepository.getProfileByUser(userId);
      if (!raw) {
        throw new NotFound("User not found");
      }

      let status = "disconnected";
      if (userId === myUserID) {
        status = "self";
      } else if (
        await this.connectionRepository.isConnected(myUserID, userId)
      ) {
        status = "connected";
      } else if (
        await this.connectionRepository.isRequested(myUserID, userId)
      ) {
        status = "requesting";
      } else if (
        await this.connectionRepository.isRequested(userId, myUserID)
      ) {
        status = "requested";
      }

      return {
        username: raw.username,
        name: raw.name,
        skills: raw.skills,
        relevant_post: raw.feeds,
        profile_photo: raw.profile_photo_path,
        work_history: raw.work_history,
        connection_count: raw._count.connectionsSent,
        connection_status: status,
      };
    }
  };

  updateProfile = async (
    id: bigint,
    payload: updateProfileDto,
    profile_photo: string | undefined | null
  ) => {
    const oldData = await this.userRepository.getUserById(id);
    if (!oldData) {
      throw new NotFound("User not found");
    }

    // if photo is deleted
    if (profile_photo === null) {
      unlink("storage/images/" + oldData.profile_photo_path, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    // if photo is updated
    if (profile_photo && oldData.profile_photo_path !== "") {
      unlink("storage/images/" + oldData.profile_photo_path, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    const profileData: ProfileData = {
      name: payload.name,
      skills: payload.skills ?? "",
      work_history: payload.work_history ?? "",
      profile_photo_path: profile_photo === null ? "" : profile_photo,
      username: payload.username,
    };
    return await this.profileRepository.updateProfile(profileData, id);
  };
}

export type ProfileData = {
  name: string;
  username: string;
  work_history: string;
  skills: string;
  profile_photo_path: string | undefined;
};

export default ProfileService;
