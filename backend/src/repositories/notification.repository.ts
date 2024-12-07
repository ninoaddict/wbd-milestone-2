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
}

export default NotificationRepository;
