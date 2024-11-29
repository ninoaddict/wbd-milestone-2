import ApplicationError from "../errors/application.error";
import prisma from "../database/prisma";

class FeedRepository {
    getFeedRepository = async (userId: bigint) => {
        const friendFeed = await prisma.feed.findMany({
            where: { 
                OR: [
                    {userId: userId},
                    {
                        user: {
                            connectionsSent: {
                                some: {
                                    OR: [
                                        {fromId: userId},
                                        {toId: userId}
                                    ]
                                }
                            }
                        }
                    }
                ]
            },
            select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                content: true,
                userId: true,
                user: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        return friendFeed;
    }

    addFeedRepository = async (userId: bigint, content: string) => {
        try {
            return await prisma.feed.create({
                data: {
                    content: content,
                    userId: userId
                },
            });
        } catch (error) {
            console.log(error)
            throw new ApplicationError("Internal server error", 500);
        }
    }

    updateFeedRepository = async (feedId: bigint, content: string) => {
        try {
            return await prisma.feed.update({
                where: {
                    id: feedId
                },
                data: {
                    content: content
                }
            })
        } catch (error) {
            console.log(error)
            throw new ApplicationError("Internal server error", 500);
        }
    }

    deleteFeedRepository = async (feedId: bigint) => {
        try {
            return await prisma.feed.delete({
                where: {
                    id: feedId
                },
            })
        } catch (error) {
            console.log(error)
            throw new ApplicationError("Internal server error", 500);
        }
    }
}

export default FeedRepository;