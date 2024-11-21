import prisma from "@/database/prisma";

class UserRepository {
  getUserById = async (id: number) => {
    return await prisma.user.findFirst({
      where: {
        id,
      },
    });
  };

  getUserByUsername = async (username: string) => {
    return await prisma.user.findFirst({
      where: {
        username,
      },
    });
  };

  getUserByEmail = async (email: string) => {
    return await prisma.user.findFirst({
      where: {
        email,
      },
    });
  };
}

export default UserRepository;
