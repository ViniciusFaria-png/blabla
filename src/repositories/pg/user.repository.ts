import { User } from "@/entities/user.entity";
import { db } from "@/lib/db";
import { IUserRepository } from "../user.repository.interface";

export class UserRepository implements IUserRepository {
  async signin(email: string): Promise<User | null> {
    const result = await db.clientInstance?.query(
      `
      SELECT * FROM "user"
      WHERE "user".email = $1
      `,
      [email]
    );
    return result?.rows[0];
  }

  async create({ email, senha }: User): Promise<User> {
    const result = await db.clientInstance?.query(
      `
      INSERT INTO "user" (email, senha) VALUES($1, $2) RETURNING *
      `,
      [email, senha]
    );

    return result?.rows[0];
  }
}
