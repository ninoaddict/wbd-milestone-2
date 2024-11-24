import prisma from "../database/prisma";
import { ProfileData } from "../services/profile.service";
import { experienceDto } from "../domain/dtos/profile.dto";
import BadRequest from "../errors/bad-request.error";

class ProfileRepository {
  addProfile = async (userId: bigint, name: string) => {
    return await prisma.profile.create({
      data: {
        userId,
        name,
      },
    });
  };

  updateProfile = async (
    profileData: ProfileData,
    newExperiences: experienceDto[],
    existingExperiences: experienceDto[],
    experienceIdsToDelete: bigint[],
    userId: bigint
  ) => {
    return await prisma.$transaction(async (tx) => {
      // Fetch existing profile
      const oldProfile = await tx.profile.findUnique({
        select: { id: true },
        where: { userId },
      });

      if (!oldProfile) {
        throw new BadRequest("Invalid userId");
      }

      const profileId = oldProfile.id;

      // Update profile data
      const updatedProfile = await tx.profile.update({
        data: { ...profileData },
        where: { userId },
      });

      // Insert new experiences
      if (newExperiences.length > 0) {
        await tx.experience.createMany({
          data: newExperiences.map((exp) => ({
            profileId,
            title: exp.title,
            companyName: exp.companyName,
            location: exp.location,
            startDate: exp.startDate,
            endDate: exp.endDate,
          })),
        });
      }

      // Update existing experiences
      if (existingExperiences.length > 0) {
        for (const exp of existingExperiences) {
          await tx.experience.update({
            where: { id: exp.id },
            data: {
              title: exp.title,
              companyName: exp.companyName,
              location: exp.location,
              startDate: exp.startDate,
              endDate: exp.endDate,
            },
          });
        }
      }

      // Delete experiences
      if (experienceIdsToDelete.length > 0) {
        await tx.experience.deleteMany({
          where: { id: { in: experienceIdsToDelete } },
        });
      }

      const updatedExperiences = await tx.experience.findMany({
        where: { profileId },
      });

      return {
        ...updatedProfile,
        experience: updatedExperiences,
      };
    });
  };

  getExperiences = async (userId: bigint) => {
    const data = await prisma.profile.findUnique({
      select: {
        experience: true,
      },
      where: {
        userId,
      },
    });
    return data?.experience;
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
