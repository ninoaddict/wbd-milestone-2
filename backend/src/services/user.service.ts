import { LoginDto, registerDto } from "@/domain/dtos/auth.dto";
import NotFound from "../errors/not-found.error";
import Unauthorized from "../errors/unauthorized.error";
import UserRepository from "../repositories/user.repository";
import bcrypt from "bcrypt";
import { jwtService } from "./jwt.service";
import { User } from "@prisma/client";
import BadRequest from "../errors/bad-request.error";

class UserService {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }

  findAllUsers = async (query: any) => {
    const users = await this.userRepository.getAllUsers(query);
    return users;
  };

  findUserByUsername = async (username: string) => {
    const user = await this.userRepository.getUserByUsername(username);
    if (!user) {
      throw new NotFound("User not found");
    }
    return user;
  };

  findUserById = async (id: number) => {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new NotFound("User not found");
    }
    return user;
  };

  findUserByEmail = async (email: string) => {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new NotFound("User not found");
    }
    return user;
  };

  findUserByIdentifier = async (identifier: string) => {
    const user = await this.userRepository.getUserByIdentifier(identifier);
    if (!user) {
      throw new NotFound("User not found");
    }
    return user;
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
      throw new BadRequest("Validation error", {
        email: "Email is already taken",
      });
    }

    if (await this.userRepository.getUserByUsername(username)) {
      throw new BadRequest("Validation error", {
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

  generateToken = (user: User) => {
    const iat = Date.now();
    const exp = iat + 3600000;
    const payload = {
      id: Number(user.id),
      email: user.email,
      username: user.username,
      name: user.name,
      iat,
      exp,
    };
    return jwtService.encode(payload);
  };
}

export default UserService;
