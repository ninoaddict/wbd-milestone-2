import ApplicationError from "../errors/application.error";
import prisma from "../database/prisma";

class ConnectionRepository {
  isConnected = async (fromId: bigint, toId: bigint) => {
    const conn = await prisma.connection.findFirst({
      where: {
        fromId,
        toId,
      },
    });
    return !!conn;
  };

  isRequested = async (fromId: bigint, toId: bigint) => {
    const conn = await prisma.connectionRequest.findFirst({
      where: {
        fromId,
        toId,
      },
    });
    return !!conn;
  };

  getAllRequests = async (toId: bigint) => {
    return await prisma.connectionRequest.findMany({
      select: {
        from: {
          select: {
            id: true,
            full_name: true,
            profile_photo_path: true,
            username: true,
          },
        },
        createdAt: true,
      },
      where: {
        toId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  };

  getAllConnections = async (fromId: bigint) => {
    return await prisma.connection.findMany({
      select: {
        to: {
          select: {
            id: true,
            full_name: true,
            profile_photo_path: true,
            username: true,
          },
        },
        createdAt: true,
      },
      where: {
        fromId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  };

  getNumberOfConnectedUsers = async (id: bigint) => {
    const data = await prisma.user.findUnique({
      select: {
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
    return data?._count.connectionsSent || 0;
  };

  sendConnectionRequest = async (fromId: bigint, toId: bigint) => {
    return await prisma.connectionRequest.create({
      data: {
        fromId,
        toId,
      },
    });
  };

  rejectConnectionRequest = async (fromId: bigint, toId: bigint) => {
    return await prisma.connectionRequest.delete({
      where: {
        fromId_toId: {
          fromId,
          toId,
        },
      },
    });
  };

  acceptConnectionRequest = async (fromId: bigint, toId: bigint) => {
    try {
      return prisma.$transaction(async (tx) => {
        const connRequest = await tx.connectionRequest.delete({
          where: {
            fromId_toId: {
              fromId,
              toId,
            },
          },
        });

        await tx.connection.create({
          data: {
            fromId,
            toId,
          },
        });

        await tx.connection.create({
          data: {
            fromId: toId,
            toId: fromId,
          },
        });

        await tx.chatRoom.create({
          data: {
            firstUserId: fromId,
            secondUserId: toId,
          },
        });
        return connRequest;
      });
    } catch (error) {
      throw new ApplicationError("Internal server error", 500);
    }
  };

  deleteConnection = async (fromId: bigint, toId: bigint) => {
    try {
      return prisma.$transaction(async (tx) => {
        const conn = await tx.connection.delete({
          where: {
            fromId_toId: {
              fromId,
              toId,
            },
          },
        });

        await tx.connection.delete({
          where: {
            fromId_toId: {
              fromId: toId,
              toId: fromId,
            },
          },
        });

        await tx.chatRoom.deleteMany({
          where: {
            OR: [
              { firstUserId: fromId, secondUserId: toId },
              { firstUserId: toId, secondUserId: fromId },
            ],
          },
        });
        return conn;
      });
    } catch (error) {
      throw new ApplicationError("Internal server error", 500);
    }
  };

  getConnectionRecommendations = async (userId: bigint) => {
    const directConnections = await prisma.connection.findMany({
      where: {
        toId: userId,
      },
      select: {
        fromId: true,
      },
    });

    const directConnectionIds = directConnections.map((c) => c.fromId);
    const secondDegreeConnections = await prisma.connection.findMany({
      where: {
        AND: [
          { toId: { in: directConnectionIds } },
          { fromId: { notIn: [...directConnectionIds, userId] } },
        ],
      },
      select: {
        fromId: true,
      },
    });

    const secondDegreeIds = secondDegreeConnections.map((c) => c.fromId);
    const thirdDegreeConnections = await prisma.connection.findMany({
      where: {
        AND: [
          { toId: { in: secondDegreeIds } },
          {
            fromId: {
              notIn: [...directConnectionIds, ...secondDegreeIds, userId],
            },
          },
        ],
      },
      select: {
        fromId: true,
      },
    });

    const thirdDegreeIds = thirdDegreeConnections.map((c) => c.fromId);
    const recommendedConnections = Array.from(
      new Set([...secondDegreeIds, ...thirdDegreeIds])
    );

    // Fetch user details for recommendations
    const recommendations = await prisma.user.findMany({
      where: {
        id: { in: recommendedConnections },
      },
      select: {
        id: true,
        username: true,
        full_name: true,
        profile_photo_path: true,
      },
    });

    return recommendations;
  };
}

export default ConnectionRepository;
