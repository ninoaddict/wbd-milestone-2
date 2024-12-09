import prisma from "../database/prisma";
import { ProfileData } from "../services/profile.service";

class ProfileRepository {
  updateProfile = async (profileData: ProfileData, id: bigint) => {
    return await prisma.user.update({
      data: {
        full_name: profileData.name,
        username: profileData.username,
        work_history: profileData.work_history,
        skills: profileData.skills,
        profile_photo_path: profileData.profile_photo_path,
      },
      where: {
        id,
      },
    });
  };

  getProfileByPublic = async (id: bigint) => {
    return await prisma.user.findUnique({
      select: {
        username: true,
        full_name: true,
        profile_photo_path: true,
        work_history: true,
        skills: true,
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
        full_name: true,
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

  getProfileByConnectedUser = async (id: bigint) => {
    return await prisma.user.findUnique({
      select: {
        username: true,
        full_name: true,
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
        full_name: true,
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
