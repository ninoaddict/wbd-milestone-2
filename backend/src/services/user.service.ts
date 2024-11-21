import NotFound from "@/errors/not-found.error";
import UserRepository from "@/repositories/user.repository";

class UserService {
  constructor(private userRepository: UserRepository) {}

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
}

export default UserService;
