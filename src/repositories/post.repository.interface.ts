import { IPost } from "@/entities/models/post.interface";

export interface IPostRepository {
  create(
    data: Omit<IPost, "id" | "created_at" | "updated_at">
  ): Promise<IPost | undefined>;
  findById(id: string): Promise<IPost | undefined>;
  findAll(): Promise<IPost[]>;
  update(
    id: string,
    data: Partial<Omit<IPost, "id" | "created_at" | "updated_at">>
  ): Promise<IPost | undefined>;
  delete(id: string): Promise<void>;
  searchQueryString(query: string): Promise<IPost[]>;
}
