import { PostRepository } from "@/repositories/pg/post.repository";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { mockPostList } from "../../../setup/mocks/entity-mocks";

vi.mock("@/lib/db", () => ({
  db: {
    clientInstance: {
      query: vi.fn(),
    },
  },
}));

import { db } from "@/lib/db";

describe("PostRepository", () => {
  let postRepository: PostRepository;

  beforeEach(() => {
    postRepository = new PostRepository();
    vi.clearAllMocks();
  });

  describe("findAll", () => {
    test("should return all posts", async () => {
      const mockPosts = mockPostList();
      (db.clientInstance?.query as any).mockResolvedValue({ rows: mockPosts });

      const result = await postRepository.findAll();

      expect(result).toEqual(mockPosts);
      expect(db.clientInstance?.query).toHaveBeenCalledWith(
        "SELECT id, titulo, resumo, conteudo, professor_id, created_at, updated_at FROM post"
      );
    });

    test("should return empty array when no posts found", async () => {
      (db.clientInstance?.query as any).mockResolvedValue({ rows: [] });

      const result = await postRepository.findAll();

      expect(result).toEqual([]);
    });

    test("should return empty array when query returns undefined", async () => {
      (db.clientInstance?.query as any).mockResolvedValue(undefined);

      const result = await postRepository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe("searchQueryString", () => {
    test("should return posts matching query", async () => {
      const mockPosts = mockPostList();
      const query = "test";
      (db.clientInstance?.query as any).mockResolvedValue({ rows: mockPosts });

      const result = await postRepository.searchQueryString(query);

      expect(result).toEqual(mockPosts);
      expect(db.clientInstance?.query).toHaveBeenCalledWith(
        "SELECT * FROM post WHERE titulo ILIKE $1 OR conteudo ILIKE $1",
        [`%${query}%`]
      );
    });

    test("should return empty array when no posts match query", async () => {
      const query = "nonexistent";
      (db.clientInstance?.query as any).mockResolvedValue({ rows: [] });

      const result = await postRepository.searchQueryString(query);

      expect(result).toEqual([]);
    });
  });
});
