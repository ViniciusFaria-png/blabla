import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { UpdatePostUseCase } from "@/use-cases/update-post";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockPost } from "../../setup/mocks/entity-mocks";
import { mockPostRepository } from "../../setup/mocks/repository-mocks";

vi.mock("@/repositories/pg/post.repository", () => ({
  PostRepository: vi.fn().mockImplementation(() => mockPostRepository),
}));

describe("UpdatePostUseCase", () => {
  let updatePostUseCase: UpdatePostUseCase;
  const postId = "some-uuid-123";

  beforeEach(() => {
    vi.clearAllMocks();
    updatePostUseCase = new UpdatePostUseCase(mockPostRepository);
  });

  it("should update a post successfully", async () => {
    const updateData = {
      titulo: "Updated Title",
      resumo: "Updated Summary",
    };
    const existingPost = mockPost({ id: postId });
    const updatedPost = { ...existingPost, ...updateData };

    mockPostRepository.update.mockResolvedValue(updatedPost);

    const result = await updatePostUseCase.execute({
      postId,
      ...updateData,
    });

    expect(result).toEqual({ post: updatedPost });
    expect(mockPostRepository.update).toHaveBeenCalledTimes(1);
    expect(mockPostRepository.update).toHaveBeenCalledWith(postId, updateData);
  });

  it("should throw ResourceNotFoundError if post not found", async () => {
    const updateData = { titulo: "Updated Title" };
    mockPostRepository.update.mockResolvedValue(null);

    await expect(
      updatePostUseCase.execute({ postId, ...updateData })
    ).rejects.toThrow(ResourceNotFoundError);
    expect(mockPostRepository.update).toHaveBeenCalledTimes(1);
    expect(mockPostRepository.update).toHaveBeenCalledWith(postId, updateData);
  });

  it("should throw error when repository throws error", async () => {
    const updateData = { titulo: "Updated Title" };
    const error = new Error("Database connection failed");
    mockPostRepository.update.mockRejectedValue(error);

    await expect(
      updatePostUseCase.execute({ postId, ...updateData })
    ).rejects.toThrow("Database connection failed");
    expect(mockPostRepository.update).toHaveBeenCalledTimes(1);
    expect(mockPostRepository.update).toHaveBeenCalledWith(postId, updateData);
  });
});
