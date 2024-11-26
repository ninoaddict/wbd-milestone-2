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
            name: true,
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
            name: true,
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
        return conn;
      });
    } catch (error) {
      throw new ApplicationError("Internal server error", 500);
    }
  };
}

export default ConnectionRepository;
