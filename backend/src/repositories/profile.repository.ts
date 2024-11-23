import prisma from "../database/prisma";

class ProfileRepository {
  addProfile = async (userId: bigint, name: string) => {
    return await prisma.profile.create({
      data: {
        userId,
        name,
      },
    });
  };

  getProfileByPublic = async (userId: bigint) => {
    return await prisma.profile.findUnique({
      select: {
        name: true,
        profile_photo: true,
        description: true,
      },
      where: {
        userId,
      },
    });
  };

  getProfileByUser = async (userId: bigint) => {
    return await prisma.profile.findUnique({
      select: {
        name: true,
        profile_photo: true,
        description: true,
        about: true,
        experience: true,
      },
      where: {
        userId,
      },
    });
  };

  getProfileByConnectedUser = async (userId: bigint) => {
    return await prisma.user.findUnique({
      select: {
        id: true,
        feeds: {
          take: 5,
        },
        profile: {
          select: {
            name: true,
            profile_photo: true,
            description: true,
            about: true,
            experience: true,
            skills: true,
          },
        },
      },
      where: {
        id: userId,
      },
    });
  };

  getSelfProfile = async (userId: bigint) => {
    return await prisma.user.findUnique({
      select: {
        id: true,
        email: true,
        username: true,
        feeds: {
          take: 5,
        },
        profile: {
          select: {
            name: true,
            profile_photo: true,
            description: true,
            about: true,
            experience: true,
            skills: true,
          },
        },
      },
      where: {
        id: userId,
      },
    });
  };
}

export default ProfileRepository;
