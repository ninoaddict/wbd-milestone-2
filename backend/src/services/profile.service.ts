import { User } from "@prisma/client";
import ProfileRepository from "../repositories/profile.repository";
import ConnectionRepository from "../repositories/connection.repository";
import { updateProfileDto } from "../domain/schema/profile.schema";
import BadRequest from "../errors/bad-request.error";

class ProfileService {
  private profileRepository: ProfileRepository;
  private connectionRepository: ConnectionRepository;
  constructor() {
    this.profileRepository = new ProfileRepository();
    this.connectionRepository = new ConnectionRepository();
  }

  getProfile = async (user: User | undefined, userId: bigint) => {
    const numberOfConnections =
      await this.connectionRepository.getNumberOfConnectedUsers(userId);

    if (!user) {
      const raw = await this.profileRepository.getProfileByPublic(userId);
      if (!raw) {
        throw new BadRequest("Invalid user id");
      }
      return {
        ...raw,
        numberOfConnections,
      };
    } else if (user.id === userId) {
      const raw = await this.profileRepository.getSelfProfile(userId);
      if (!raw) {
        throw new BadRequest("Invalid user id");
      }
      return {
        id: raw?.id,
        username: raw?.id,
        email: raw?.id,
        feeds: raw?.feeds,
        ...raw?.profile,
        numberOfConnections,
      };
    } else if (await this.connectionRepository.isConnected(user.id, userId)) {
      const raw = await this.profileRepository.getProfileByConnectedUser(
        userId
      );
      if (!raw) {
        throw new BadRequest("Invalid user id");
      }
      return {
        id: raw?.id,
        feeds: raw?.feeds,
        ...raw?.profile,
        numberOfConnections,
      };
    } else {
      const raw = await this.profileRepository.getProfileByUser(userId);
      if (!raw) {
        throw new BadRequest("Invalid user id");
      }
      return {
        ...raw,
        numberOfConnections,
      };
    }
  };

  updateProfile = async (
    userId: bigint,
    payload: updateProfileDto,
    profile_photo: string | undefined
  ) => {
    const { experience, ...profileData } = payload;

    const newExperiences = experience.filter((exp) => !exp.id);
    const existingExperiences = experience.filter((exp) => exp.id);
    const currentExperiences = await this.profileRepository.getExperiences(
      userId
    );

    if (!currentExperiences) {
      throw new BadRequest("Invalid user id");
    }

    const currExpIds = currentExperiences.map((exp) => exp.id);
    const expIdsToDelete = currExpIds.filter((id) => {
      !existingExperiences.some((exp) => exp.id === id);
    });

    const profileDataFin: ProfileData = {
      ...profileData,
      profile_photo,
    };

    return await this.profileRepository.updateProfile(
      profileDataFin,
      newExperiences,
      existingExperiences,
      expIdsToDelete,
      userId
    );
  };
}

export type ProfileData = {
  name: string;
  skills: string[];
  description?: string | undefined;
  about?: string | undefined;
  profile_photo: string | undefined;
};

export default ProfileService;
