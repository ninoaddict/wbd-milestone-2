// import Unauthorized from "../errors/unauthorized.error";
import FeedRepository from "../repositories/feed.repository";
import BadRequest from "../errors/bad-request.error";
// import { off } from "process";

class FeedService {
  private feedRepository: FeedRepository;

  constructor() {
    this.feedRepository = new FeedRepository();
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
    if (!userId) {
      throw new BadRequest();
    }
    if (content) await this.feedRepository.addFeedRepository(userId, content);
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
