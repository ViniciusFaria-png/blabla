import { IPost } from "@/entities/models/post.interface";
import { db } from "@/lib/db";
import { IPostRepository } from "../post.repository.interface";

export class PostRepository implements IPostRepository {
  async create(
    data: Omit<IPost, "id" | "created_at" | "updated_at">
  ): Promise<IPost | undefined> {
    const result = await db.clientInstance?.query<IPost>(
      `INSERT INTO post (titulo, resumo, conteudo, professor_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING id, titulo, resumo, conteudo, professor_id, created_at, updated_at`,
      [data.titulo, data.resumo, data.conteudo, data.professor_id]
    );
    return result?.rows[0];
  }
  async findAll(): Promise<IPost[]> {
    const result = await db.clientInstance?.query<IPost>(
      `SELECT id, titulo, resumo, conteudo, professor_id, created_at, updated_at FROM post`
    );
    return result?.rows || [];
  }
  async findById(id: string): Promise<IPost | undefined> {
    const result = await db.clientInstance?.query<IPost>(
      `SELECT id, titulo, resumo, conteudo, professor_id, created_at, updated_at FROM post WHERE id = $1`,
      [id]
    );
    return result?.rows[0];
  }
  async update(
    id: string,
    data: Partial<Omit<IPost, "id" | "created_at" | "updated_at">>
  ): Promise<IPost | undefined> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (data.titulo !== undefined) {
      fields.push(`titulo = $${paramIndex++}`);
      values.push(data.titulo);
    }
    if (data.resumo !== undefined) {
      fields.push(`resumo = $${paramIndex++}`);
      values.push(data.resumo);
    }
    if (data.conteudo !== undefined) {
      fields.push(`conteudo = $${paramIndex++}`);
      values.push(data.conteudo);
    }
    if (data.professor_id !== undefined) {
      fields.push(`professor_id = $${paramIndex++}`);
      values.push(data.professor_id);
    }

    fields.push(`updated_at = NOW()`);

    values.push(id);

    if (fields.length === 0) {
      return this.findById(id);
    }

    const setClause = fields.join(", ");
    const query = `UPDATE post SET ${setClause} WHERE id = $${paramIndex} RETURNING id, titulo, resumo, conteudo, professor_id, created_at, updated_at`;

    const result = await db.clientInstance?.query<IPost>(query, values);
    return result?.rows[0];
  }

  async delete(id: string): Promise<void> {
    await db.clientInstance?.query(`DELETE FROM post WHERE id = $1`, [id]);
  }
  public async searchQueryString(query: string): Promise<IPost[]> {
    const result = await db.clientInstance?.query<IPost>(
      `SELECT * FROM post WHERE titulo ILIKE $1 OR conteudo ILIKE $1`,
      [`%${query}%`]
    );

    return result?.rows || [];
  }
}
