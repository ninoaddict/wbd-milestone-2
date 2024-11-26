import ApplicationError from "../errors/application.error";
import prisma from "../database/prisma";

class UserRepository {
  getAllUsers = async (query: string | undefined) => {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        profile_photo_path: true,
      },
      where: {
        OR: query
          ? [
              {
                username: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ]
          : undefined,
      },
    });
  };

  getUserById = async (id: bigint) => {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  };

  getUserByUsername = async (username: string) => {
    return await prisma.user.findUnique({
      where: {
        username,
      },
    });
  };

  getUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
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

  addUser = async (
    email: string,
    username: string,
    passwordHash: string,
    name: string
  ) => {
    try {
      return await prisma.user.create({
        data: {
          email,
          username,
          passwordHash,
          name,
          work_history: "",
          skills: "",
          profile_photo_path: "",
        },
      });
    } catch (error) {
      throw new ApplicationError("Internal server error", 500);
    }
  };
}

export default UserRepository;
