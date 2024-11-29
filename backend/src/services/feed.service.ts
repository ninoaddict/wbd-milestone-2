// import Unauthorized from "../errors/unauthorized.error";
import FeedRepository from "../repositories/feed.repository";
import BadRequest from "../errors/bad-request.error";

class FeedService {
    private feedRepository: FeedRepository;

    constructor() {
        this.feedRepository = new FeedRepository();
    }

    getFeeds = async (userId?: bigint) => {
        if (!userId) {
            throw new BadRequest();
        }
        const raw = await this.feedRepository.getFeedRepository(userId);
        const myMapped = raw.map((f) => {
            const myDatum = {
                id: f.id,
                createdAt: f.createdAt,
                updatedAt: f.updatedAt,
                userId: f.userId,
                content: f.content,
                name: f.user.name
            };
            return myDatum;
        });
        
        return myMapped;
    };

    postFeeds = async(userId?: bigint, content?: string) => {
        if (!userId) {
            throw new BadRequest();
        }
        if (content)
        await this.feedRepository.addFeedRepository(userId, content);
    }

    updateFeeds = async(userId?: bigint, content?: string) => {
        if (!userId) {
            throw new BadRequest();
        }
        if (content)
        await this.feedRepository.updateFeedRepository(userId, content);
    }

    deleteFeeds = async(userId?: bigint) => {
        if (!userId) {
            throw new BadRequest();
        }
        await this.feedRepository.deleteFeedRepository(userId);
    }
}

export default FeedService;