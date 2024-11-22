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
}

export default ProfileRepository;
