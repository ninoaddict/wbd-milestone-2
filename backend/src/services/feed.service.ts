import FeedRepository from "../repositories/feed.repository";
import BadRequest from "../errors/bad-request.error";
import NotificationRepository from "../repositories/notification.repository";
import UserRepository from "../repositories/user.repository";
import { Prisma } from "@prisma/client";
import webPush from "../config/webPushConfig";
import prisma from "../database/prisma";
import Unauthorized from "../errors/unauthorized.error";
import { ORIGIN } from "../config";

class FeedService {
  private feedRepository: FeedRepository;
  private notificationRepository: NotificationRepository;
  private userRepository: UserRepository;

  constructor() {
    this.feedRepository = new FeedRepository();
    this.notificationRepository = new NotificationRepository();
    this.userRepository = new UserRepository();
  }

  getFeeds = async (limit: number, cursor?: bigint, userId?: bigint) => {
    if (!userId) {
      throw new Unauthorized();
    }
    const raw = await this.feedRepository.getFeeds(userId, limit, cursor);
    const feeds = raw.feeds.map((feed) => {
      return {
        id: feed.id,
        createdAt: feed.createdAt,
        updatedAt: feed.updatedAt,
        content: feed.content,
        userId: feed.userId,
        username: feed.user.username,
        name: feed.user.full_name,
        profile_photo_path: feed.user.profile_photo_path,
      };
    });
    return {
      feeds,
      hasNextPage: raw.hasNextPage,
      nextCursor: raw.nextCursor,
    };
  };

  postFeeds = async (userId?: bigint, content?: string) => {
    if (!userId || !content) {
      throw new BadRequest();
    }
    const newFeed = await this.feedRepository.addFeedRepository(
      userId,
      content
    );
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
            myProfile?.full_name || ""
          } just uploaded a new post. Click to see.`,
          url: ORIGIN || `http://localhost:5173/`,
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

    return newFeed;
  };

  updateFeeds = async (feedId?: bigint, userId?: bigint, content?: string) => {
    if (!userId || !content || !feedId) {
      throw new BadRequest();
    }
    if (!(await this.feedRepository.userHasFeed(userId, feedId))) {
      throw new Unauthorized();
    }
    return await this.feedRepository.updateFeedRepository(feedId, content);
  };

  deleteFeeds = async (feedId?: bigint, userId?: bigint) => {
    if (!userId || !feedId) {
      throw new BadRequest();
    }
    if (!(await this.feedRepository.userHasFeed(userId, feedId))) {
      throw new Unauthorized();
    }
    return await this.feedRepository.deleteFeedRepository(feedId);
  };
}

export default FeedService;
