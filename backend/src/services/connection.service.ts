import Unauthorized from "../errors/unauthorized.error";
import ConnectionRepository from "../repositories/connection.repository";
import BadRequest from "../errors/bad-request.error";

class ConnectionService {
  private connectionRepository: ConnectionRepository;

  constructor() {
    this.connectionRepository = new ConnectionRepository();
  }

  getAllRequests = async (toId: bigint) => {
    if (!toId) {
      throw new BadRequest();
    }

    const raw = await this.connectionRepository.getAllRequests(toId);
    const data = raw.map((f) => {
      const datum = {
        createdAt: f.createdAt,
        user: {
          id: f.from.id,
          username: f.from.username,
          name: f.from.full_name,
          profile_photo_path: f.from.profile_photo_path,
        },
      };
      return datum;
    });
    return data;
  };

  getAllConnections = async (fromId: bigint) => {
    if (!fromId) {
      throw new BadRequest();
    }
    const raw = await this.connectionRepository.getAllConnections(fromId);
    const data = raw.map((f) => {
      const datum = {
        createdAt: f.createdAt,
        user: {
          id: f.to.id,
          username: f.to.username,
          name: f.to.full_name,
          profile_photo_path: f.to.profile_photo_path,
        },
      };
      return datum;
    });
    return data;
  };

  sendConnectionRequest = async (fromId: bigint, toId: bigint) => {
    if (!fromId || !toId || fromId === toId) {
      throw new BadRequest();
    }
    if (await this.connectionRepository.isConnected(fromId, toId)) {
      throw new Unauthorized("User already connected");
    }
    if (await this.connectionRepository.isRequested(fromId, toId)) {
      throw new Unauthorized("Connection request has been sent");
    }
    if (await this.connectionRepository.isRequested(toId, fromId)) {
      throw new Unauthorized("This user has sent connection request");
    }

    return await this.connectionRepository.sendConnectionRequest(fromId, toId);
  };

  rejectConnnectionRequest = async (fromId: bigint, toId: bigint) => {
    if (!fromId || !toId || fromId === toId) {
      throw new BadRequest();
    }
    if (!(await this.connectionRepository.isRequested(fromId, toId))) {
      throw new Unauthorized("Connection request has never been sent");
    }
    return await this.connectionRepository.rejectConnectionRequest(
      fromId,
      toId
    );
  };

  acceptConnectionRequest = async (fromId: bigint, toId: bigint) => {
    if (!fromId || !toId || fromId === toId) {
      throw new BadRequest();
    }
    if (!(await this.connectionRepository.isRequested(fromId, toId))) {
      throw new Unauthorized("Connection request has never been sent");
    }
    return await this.connectionRepository.acceptConnectionRequest(
      fromId,
      toId
    );
  };

  deleteConnection = async (fromId: bigint, toId: bigint) => {
    if (!fromId || !toId || fromId === toId) {
      throw new BadRequest();
    }
    if (!(await this.connectionRepository.isConnected(fromId, toId))) {
      throw new Unauthorized("Connection has not been established");
    }
    return await this.connectionRepository.deleteConnection(fromId, toId);
  };

  getRecommendations = async (userId: bigint) => {
    const recommendations =
      await this.connectionRepository.getConnectionRecommendations(userId);
    return recommendations.map((rec) => {
      return {
        id: rec.id,
        username: rec.username,
        name: rec.full_name,
        profile_photo_path: rec.profile_photo_path,
      };
    });
  };
}

export default ConnectionService;
