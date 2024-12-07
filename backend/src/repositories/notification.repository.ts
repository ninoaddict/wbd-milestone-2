import prisma from "../database/prisma";
import { Subscription } from "../domain/dtos/notification.dto";

class NotificationRepository {
  subscribe = async (subscriptionData: Subscription, userId: bigint) => {
    return await prisma.pushSubscription.create({
      data: {
        endpoint: subscriptionData.endpoint,
        userId,
        keys: subscriptionData.keys,
      },
    });
  };

  unsubscribe = async (endpoint: string) => {
    return await prisma.pushSubscription.delete({
      where: {
        endpoint,
      },
    });
  };

  getConnectedSubscriptions = async (userId: bigint) => {
    return await prisma.$transaction(async (tx) => {
      const connections = await tx.connection.findMany({
        where: {
          fromId: userId,
        },
        select: {
          toId: true,
        },
      });

      const connectedUserIds = connections.map((connection) => connection.toId);

      const subscriptions = await tx.pushSubscription.findMany({
        where: {
          userId: {
            in: connectedUserIds,
          },
        },
      });

      return subscriptions;
    });
  };
}

export default NotificationRepository;
