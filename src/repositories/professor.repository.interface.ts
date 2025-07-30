import { Professor } from "../entities/professor.entity";

export interface IProfessorRepository {
  create(professor: Professor): Promise<Professor>;
  getName(id: number): Promise<string>;
  getProfessorId(userId: number): Promise<number>;
  findByUserId(userId: number): Promise<Professor | null>;
}
