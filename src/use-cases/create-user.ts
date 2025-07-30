import { User } from "@/entities/user.entity";
import { IUserRepository } from "@/repositories/user.repository.interface";
import { hash } from "bcryptjs";

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async handler(user: User): Promise<User> {
    const { email, senha } = user;
    const hashedPassword = await hash(senha, 8);

    const newUser = await this.userRepository.create({
      email,
      senha: hashedPassword,
    });

    return newUser;
  }

  
}
