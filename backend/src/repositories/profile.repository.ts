import prisma from "../database/prisma";
import { ProfileData } from "../services/profile.service";

class ProfileRepository {
  updateProfile = async (profileData: ProfileData, id: bigint) => {
    return await prisma.user.update({
      data: profileData,
      where: {
        id,
      },
    });
  };

  getProfileByPublic = async (id: bigint) => {
    return await prisma.user.findUnique({
      select: {
        username: true,
        name: true,
        profile_photo_path: true,
        _count: {
          select: {
            connectionsSent: true,
          },
        },
      },
      where: {
        id,
      },
    });
  };

  getProfileByUser = async (id: bigint) => {
    return await prisma.user.findUnique({
      select: {
        username: true,
        name: true,
        profile_photo_path: true,
        work_history: true,
        _count: {
          select: {
            connectionsSent: true,
          },
        },
      },
      where: {
        id,
      },
    });
  };

  getProfileByConnectedUser = async (id: bigint) => {
    return await prisma.user.findUnique({
      select: {
        username: true,
        name: true,
        profile_photo_path: true,
        work_history: true,
        skills: true,
        feeds: true,
        _count: {
          select: {
            connectionsSent: true,
          },
        },
      },
      where: {
        id,
      },
    });
  };

  getSelfProfile = async (id: bigint) => {
    return await prisma.user.findUnique({
      select: {
        username: true,
        name: true,
        profile_photo_path: true,
        work_history: true,
        skills: true,
        feeds: true,
        _count: {
          select: {
            connectionsSent: true,
          },
        },
      },
      where: {
        id,
      },
    });
  };
}

export default ProfileRepository;
