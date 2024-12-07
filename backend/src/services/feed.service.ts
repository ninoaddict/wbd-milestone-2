import FeedRepository from "../repositories/feed.repository";
import BadRequest from "../errors/bad-request.error";
import NotificationRepository from "../repositories/notification.repository";
import UserRepository from "../repositories/user.repository";
import { Prisma } from "@prisma/client";
import webPush from "../config/webPushConfig";
import prisma from "../database/prisma";

class FeedService {
  private feedRepository: FeedRepository;
  private notificationRepository: NotificationRepository;
  private userRepository: UserRepository;

  constructor() {
    this.feedRepository = new FeedRepository();
    this.notificationRepository = new NotificationRepository();
    this.userRepository = new UserRepository();
  }

  getFeeds = async (limit: any, offset: any, userId?: bigint) => {
    if (!userId) {
      throw new BadRequest();
    }
    const raw = await this.feedRepository.getFeedRepository(
      userId,
      limit,
      offset
    );
    const myMapped = raw.map((f) => {
      const myDatum = {
        id: f.id,
        createdAt: f.createdAt,
        updatedAt: f.updatedAt,
        userId: f.userId,
        content: f.content,
        name: f.user.name,
      };
      return myDatum;
    });

    return myMapped;
  };

  getMyFeeds = async (userId?: bigint) => {
    if (!userId) {
      throw new BadRequest();
    }
    const raw = await this.feedRepository.getMyFeedRepository(userId);
    const myMapped = raw.map((f) => {
      const myDatum = {
        id: f.id,
        createdAt: f.createdAt,
        updatedAt: f.updatedAt,
        userId: f.userId,
        content: f.content,
      };
      return myDatum;
    });
    return myMapped;
  };

  postFeeds = async (userId?: bigint, content?: string) => {
    if (!userId || !content) {
      throw new BadRequest();
    }
    await this.feedRepository.addFeedRepository(userId, content);
    const subscriptions =
      await this.notificationRepository.getConnectedSubscriptions(userId);
    const myProfile = await this.userRepository.getUserById(userId);

    // run notification in the background
    setImmediate(() => {
      subscriptions.forEach(async (raw) => {
        const endpoint = raw.endpoint;
        const keys = raw.keys as Prisma.JsonObject;
        const p256dh = keys.p256dh as string;
        const auth = keys.auth as string;

        const payload = {
          title: "New Post",
          body: `${
            myProfile?.name || ""
          } just uploaded a new post. Click to see.`,
          url: `http://localhost:5173/`,
        };

        try {
          await webPush.sendNotification(
            {
              endpoint,
              keys: {
                p256dh,
                auth,
              },
            },
            JSON.stringify(payload)
          );
        } catch (error: any) {
          if (error.statusCode === 410 || error.statusCode === 404) {
            await prisma.pushSubscription.delete({
              where: { endpoint },
            });
          } else {
            console.error("Push notification error:", error);
          }
        }
      });
    });
  };

  updateFeeds = async (userId?: bigint, content?: string) => {
    if (!userId) {
      throw new BadRequest();
    }
    if (content)
      await this.feedRepository.updateFeedRepository(userId, content);
  };

  deleteFeeds = async (userId?: bigint) => {
    if (!userId) {
      throw new BadRequest();
    }
    await this.feedRepository.deleteFeedRepository(userId);
  };
}

export default FeedService;
