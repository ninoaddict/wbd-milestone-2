import ApplicationError from "../errors/application.error";
import prisma from "../database/prisma";
import NotFound from "../errors/not-found.error";

class FeedRepository {
  userHasFeed = async (userId: bigint, feedId: bigint) => {
    const feed = await prisma.feed.findUnique({
      where: {
        id: feedId,
        userId,
      },
    });
    return !!feed;
  };

  getFeeds = async (userId: bigint, limit: number, cursor?: bigint) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        connectionsSent: {
          select: { toId: true },
        },
      },
    });

    if (!user) {
      throw new NotFound("User not found");
    }

    const connections = [
      ...user.connectionsSent.map((conn) => conn.toId),
      userId,
    ];

    const feeds = await prisma.feed.findMany({
      where: {
        userId: { in: connections },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        content: true,
        user: {
          select: {
            name: true,
            username: true,
            profile_photo_path: true,
          },
        },
      },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const hasNextPage = feeds.length > limit;
    const nextCursor = hasNextPage ? feeds.pop()?.id : undefined;

    return {
      feeds,
      nextCursor,
      hasNextPage,
    };
  };

  addFeedRepository = async (userId: bigint, content: string) => {
    try {
      return await prisma.feed.create({
        data: {
          content: content,
          userId: userId,
        },
      });
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Internal server error", 500);
    }
  };

  updateFeedRepository = async (feedId: bigint, content: string) => {
    console.log(content);
    console.log(feedId);
    try {
      return await prisma.feed.update({
        where: {
          id: feedId,
        },
        data: {
          content: content,
        },
      });
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Internal server error", 500);
    }
  };

  deleteFeedRepository = async (feedId: bigint) => {
    try {
      return await prisma.feed.delete({
        where: {
          id: feedId,
        },
      });
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Internal server error", 500);
    }
  };
}

export default FeedRepository;
