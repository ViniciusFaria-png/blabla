import { FindAllPostsUseCase } from "@/use-cases/find-all-posts";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockPostList } from "../../setup/mocks/entity-mocks";
import { mockPostRepository } from "../../setup/mocks/repository-mocks";

vi.mock("@/repositories/pg/post.repository", () => ({
  PostRepository: vi.fn().mockImplementation(() => mockPostRepository),
}));

describe("FindAllPostsUseCase", () => {
  let findAllPostsUseCase: FindAllPostsUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    findAllPostsUseCase = new FindAllPostsUseCase(mockPostRepository);
  });

  it("should return all posts when posts exist", async () => {
    const expectedPosts = mockPostList();
    mockPostRepository.findAll.mockResolvedValue(expectedPosts);

    const result = await findAllPostsUseCase.execute();

    expect(result).toEqual({ posts: expectedPosts });
    expect(mockPostRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it("should return empty array when no posts exist", async () => {
    mockPostRepository.findAll.mockResolvedValue([]);

    const result = await findAllPostsUseCase.execute();

    expect(result).toEqual({ posts: [] });
    expect(mockPostRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it("should throw error when repository throws error", async () => {
    const error = new Error("Database connection failed");
    mockPostRepository.findAll.mockRejectedValue(error);

    await expect(findAllPostsUseCase.execute()).rejects.toThrow(
      "Database connection failed"
    );
    expect(mockPostRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
