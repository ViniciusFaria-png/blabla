import { IUser } from "./models/user.interface";

export class User implements IUser {
  id?: number;
  email: string;
  senha: string;

  constructor(username: string, password: string) {
    this.email = username;
    this.senha = password;
  }
}
