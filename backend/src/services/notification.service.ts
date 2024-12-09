import NotificationRepository from "../repositories/notification.repository";
import { Subscription } from "@/domain/dtos/notification.dto";

class NotificationService {
  private notificationRepository: NotificationRepository;

  constructor() {
    this.notificationRepository = new NotificationRepository();
  }

  subscribe = async (subscriptionData: Subscription, userId: bigint) => {
    return await this.notificationRepository.subscribe(
      subscriptionData,
      userId
    );
  };

  unsubscribe = async (endpoint: string) => {
    return await this.notificationRepository.unsubscribe(endpoint);
  };
}

export default NotificationService;
