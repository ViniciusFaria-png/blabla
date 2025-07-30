import { DeletePostUseCase } from "@/use-cases/delete-post";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockPost } from "../../setup/mocks/entity-mocks";
import { mockPostRepository } from "../../setup/mocks/repository-mocks";

vi.mock("@/repositories/pg/post.repository", () => ({
  PostRepository: vi.fn().mockImplementation(() => mockPostRepository),
}));

describe("DeletePostUseCase", () => {
  let deletePostUseCase: DeletePostUseCase;
  const postId = "some-uuid-123";

  beforeEach(() => {
    vi.clearAllMocks();
    deletePostUseCase = new DeletePostUseCase(mockPostRepository);
  });

  it("should delete a post successfully if it exists", async () => {
    mockPostRepository.findById.mockResolvedValue(mockPost({ id: postId }));
    mockPostRepository.delete.mockResolvedValue(undefined);

    await expect(deletePostUseCase.execute({ postId })).resolves.toBeUndefined();
    expect(mockPostRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockPostRepository.findById).toHaveBeenCalledWith(postId);
    expect(mockPostRepository.delete).toHaveBeenCalledTimes(1);
    expect(mockPostRepository.delete).toHaveBeenCalledWith(postId);
  });

  it("should throw ResourceNotFoundError if post not found", async () => {
    mockPostRepository.findById.mockResolvedValue(null);

    await expect(deletePostUseCase.execute({ postId })).rejects.toThrow(
      ResourceNotFoundError
    );
    expect(mockPostRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockPostRepository.findById).toHaveBeenCalledWith(postId);
    expect(mockPostRepository.delete).not.toHaveBeenCalled();
  });

  it("should throw error when findById repository throws error", async () => {
    const error = new Error("Database connection failed");
    mockPostRepository.findById.mockRejectedValue(error);

    await expect(deletePostUseCase.execute({ postId })).rejects.toThrow(
      "Database connection failed"
    );
    expect(mockPostRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockPostRepository.delete).not.toHaveBeenCalled();
  });

  it("should throw error when delete repository throws error", async () => {
    const error = new Error("Database deletion failed");
    mockPostRepository.findById.mockResolvedValue(mockPost({ id: postId }));
    mockPostRepository.delete.mockRejectedValue(error);

    await expect(deletePostUseCase.execute({ postId })).rejects.toThrow(
      "Database deletion failed"
    );
    expect(mockPostRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockPostRepository.delete).toHaveBeenCalledTimes(1);
  });
});