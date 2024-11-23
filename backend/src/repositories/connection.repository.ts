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
        await tx.connectionRequest.delete({
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
        return true;
      });
    } catch (error) {
      throw new ApplicationError("Internal server error", 500);
    }
  };

  deleteConnection = async (fromId: bigint, toId: bigint) => {
    try {
      return prisma.$transaction(async (tx) => {
        await tx.connection.delete({
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
        return true;
      });
    } catch (error) {
      throw new ApplicationError("Internal server error", 500);
    }
  };
}

export default ConnectionRepository;
