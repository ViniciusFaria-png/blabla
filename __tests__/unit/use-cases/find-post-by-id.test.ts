import { FindPostByIdUseCase } from "@/use-cases/find-post-by-id";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockPost } from "../../setup/mocks/entity-mocks";
import { mockPostRepository } from "../../setup/mocks/repository-mocks";

vi.mock("@/repositories/pg/post.repository", () => ({
  PostRepository: vi.fn().mockImplementation(() => mockPostRepository),
}));

describe("FindPostByIdUseCase", () => {
  let findPostByIdUseCase: FindPostByIdUseCase;
  const postId = "some-uuid-123";

  beforeEach(() => {
    vi.clearAllMocks();
    findPostByIdUseCase = new FindPostByIdUseCase(mockPostRepository);
  });

  it("should return a post when a valid ID is provided", async () => {
    const expectedPost = mockPost({ id: postId });
    mockPostRepository.findById.mockResolvedValue(expectedPost);

    const result = await findPostByIdUseCase.execute({ postId });

    expect(result).toEqual({ post: expectedPost });
    expect(mockPostRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockPostRepository.findById).toHaveBeenCalledWith(postId);
  });

  it("should throw ResourceNotFoundError if post not found", async () => {
    mockPostRepository.findById.mockResolvedValue(null);

    await expect(findPostByIdUseCase.execute({ postId })).rejects.toThrow(
      ResourceNotFoundError
    );
    expect(mockPostRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockPostRepository.findById).toHaveBeenCalledWith(postId);
  });

  it("should throw error when repository throws error", async () => {
    const error = new Error("Database connection failed");
    mockPostRepository.findById.mockRejectedValue(error);

    await expect(findPostByIdUseCase.execute({ postId })).rejects.toThrow(
      "Database connection failed"
    );
    expect(mockPostRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockPostRepository.findById).toHaveBeenCalledWith(postId);
  });
});