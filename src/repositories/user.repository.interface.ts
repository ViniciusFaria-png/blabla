import { User } from "@/entities/user.entity";

export interface IUserRepository {
  create(user: User): Promise<User>;
  signin(username: string): Promise<User | null>;
}