import { Professor } from "@/entities/professor.entity";
import { db } from "@/lib/db";
import { IProfessorRepository } from "../professor.repository.interface";

export class ProfessorRepository implements IProfessorRepository {
  async create({ nome, materia, user_id }: Professor): Promise<Professor> {
    const result = await db.clientInstance?.query(
      `
      INSERT INTO "professor" (nome, materia, user_id) VALUES ($1, $2, $3) RETURNING *
      `,
      [nome, materia, user_id]
    );

    return result?.rows[0];
  }

  async getName(id: number): Promise<string> {
    const result = await db.clientInstance?.query(
      `
      SELECT nome FROM professor WHERE professor.user_id = $1
      `,
      [id]
    );

    const nome = result?.rows[0].nome;

    return nome;
  }

  async getProfessorId(userId: number): Promise<number> {
    const result = await db.clientInstance?.query(
      `
      SELECT id FROM professor WHERE professor.user_id = $1
      `,
      [userId]
    );

    return result?.rows[0]?.id;
  }

  async findByUserId(userId: number): Promise<Professor | null> {
    const result = await db.clientInstance?.query(
      `
      SELECT * FROM professor WHERE professor.user_id = $1
      `,
      [userId]
    );

    return result?.rows[0] || null;
  }
}
