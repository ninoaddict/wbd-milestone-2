import prisma from "../database/prisma";

class UserRepository {
  getAllUsers = async (query: string | undefined) => {
    return await prisma.user.findMany({
      select: {
        email: true,
        username: true,
        id: true,
        profile: {
          select: {
            name: true,
            profile_photo: true,
            description: true,
          },
        },
      },
      where: {
        OR: [
          {
            username: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            profile: {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        ],
      },
    });
  };

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

  getUserByIdentifier = async (identifier: string) => {
    return await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: identifier,
          },
          {
            email: identifier,
          },
        ],
      },
    });
  };

  addUser = async (email: string, username: string, passwordHash: string) => {
    return await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
      },
    });
  };
}

export default UserRepository;
