import { LoginDto, registerDto } from "@/domain/dtos/auth.dto";
import NotFound from "../errors/not-found.error";
import Unauthorized from "../errors/unauthorized.error";
import UserRepository from "../repositories/user.repository";
import bcrypt from "bcrypt";
import { jwtService } from "./jwt.service";
import BadRequest from "../errors/bad-request.error";
import ConnectionRepository from "../repositories/connection.repository";
import redis from "../redis/redis";

class UserService {
  private userRepository: UserRepository;
  private connectionRepository: ConnectionRepository;
  constructor() {
    this.userRepository = new UserRepository();
    this.connectionRepository = new ConnectionRepository();
  }

  findAllUsers = async (query: any, userId?: bigint) => {
    let users;
    const cachedUsers = await redis.get("users");
    if (cachedUsers) {
      const parsedUsers: any[] = JSON.parse(cachedUsers);
      users = parsedUsers.map((user) => {
        return {
          id: BigInt(user.id),
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          profile_photo_path: user.profile_photo_path,
        };
      });
    } else {
      users = await this.userRepository.getAllUsers(query);
      await redis.setex(
        "users",
        60,
        JSON.stringify(users, (_, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
    }
    if (!userId) {
      return users.map((user) => {
        return {
          username: user.username,
          id: user.id,
          email: user.email,
          name: user.full_name,
          profile_photo_path: user.profile_photo_path,
        };
      });
    }
    const finalUsers = await Promise.all(
      users.map(async (user) => {
        let status = "disconnected";
        if (user.id === userId) {
          status = "self";
        } else if (
          await this.connectionRepository.isConnected(userId, user.id)
        ) {
          status = "connected";
        } else if (
          await this.connectionRepository.isRequested(user.id, userId)
        ) {
          status = "requested";
        } else if (
          await this.connectionRepository.isRequested(userId, user.id)
        ) {
          status = "requesting";
        }
        return {
          username: user.username,
          id: user.id,
          email: user.email,
          name: user.full_name,
          profile_photo_path: user.profile_photo_path,
          status,
        };
      })
    );
    return finalUsers;
  };

  findUserByUsername = async (username: string) => {
    const user = await this.userRepository.getUserByUsername(username);
    if (!user) {
      throw new NotFound("User not found");
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
      name: user.full_name,
      work_history: user.work_history,
      skills: user.skills,
      profile_photo_path: user.profile_photo_path,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  };

  findUserById = async (id: bigint) => {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new NotFound("User not found");
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
      name: user.full_name,
      work_history: user.work_history,
      skills: user.skills,
      profile_photo_path: user.profile_photo_path,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  };

  findLimitedUserById = async (id: bigint) => {
    const user = await this.userRepository.getLimitedUserById(id);
    if (!user) {
      throw new NotFound("User not found");
    }
    return {
      id: user.id,
      username: user.username,
      name: user.full_name,
      profile_photo_path: user.profile_photo_path,
    };
  };

  findUserByEmail = async (email: string) => {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new NotFound("User not found");
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
      name: user.full_name,
      work_history: user.work_history,
      skills: user.skills,
      profile_photo_path: user.profile_photo_path,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  };

  findUserByIdentifier = async (identifier: string) => {
    const user = await this.userRepository.getUserByIdentifier(identifier);
    if (!user) {
      throw new NotFound("User not found");
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
      name: user.full_name,
      work_history: user.work_history,
      skills: user.skills,
      profile_photo_path: user.profile_photo_path,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  };

  login = async ({ identifier, password }: LoginDto) => {
    const user = await this.findUserByIdentifier(identifier);
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Unauthorized("Invalid credentials");
    }
    const token = this.generateToken(user);
    return { token };
  };

  register = async ({ email, username, password, name }: registerDto) => {
    if (await this.userRepository.getUserByEmail(email)) {
      throw new BadRequest("Email is already taken", {
        email: "Email is already taken",
      });
    }

    if (await this.userRepository.getUserByUsername(username)) {
      throw new BadRequest("Username is already taken", {
        email: "Username is already taken",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.addUser(
      email,
      username,
      hashedPassword,
      name
    );

    const token = this.generateToken(user);
    return { token };
  };

  generateToken = (user: any) => {
    const iat = Date.now();
    const exp = iat + 3600000;
    const payload = {
      id: Number(user.id),
      email: user.email,
      iat,
      exp,
    };
    return jwtService.encode(payload);
  };
}

export default UserService;
