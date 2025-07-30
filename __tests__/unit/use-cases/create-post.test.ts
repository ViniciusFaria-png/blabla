import { CreatePostUseCase } from "@/use-cases/create-post";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockCreatePostData, mockPost } from "../../setup/mocks/entity-mocks";
import { mockPostRepository } from "../../setup/mocks/repository-mocks";

vi.mock("@/repositories/pg/post.repository", () => ({
  PostRepository: vi.fn().mockImplementation(() => mockPostRepository),
}));

describe("CreatePostUseCase", () => {
  let createPostUseCase: CreatePostUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    createPostUseCase = new CreatePostUseCase(mockPostRepository);
  });

  it("should create a new post successfully", async () => {
    const postData = mockCreatePostData();
    const expectedPost = mockPost(postData);
    mockPostRepository.create.mockResolvedValue(expectedPost);

    const result = await createPostUseCase.execute(postData);

    expect(result).toEqual({ post: expectedPost });
    expect(mockPostRepository.create).toHaveBeenCalledTimes(1);
    expect(mockPostRepository.create).toHaveBeenCalledWith(postData);
  });

  it("should throw an error if post creation fails", async () => {
    const postData = mockCreatePostData();
    mockPostRepository.create.mockResolvedValue(null);

    await expect(createPostUseCase.execute(postData)).rejects.toThrow(
      "Failed to create post."
    );
    expect(mockPostRepository.create).toHaveBeenCalledTimes(1);
    expect(mockPostRepository.create).toHaveBeenCalledWith(postData);
  });

  it("should throw error when repository throws error", async () => {
    const postData = mockCreatePostData();
    const error = new Error("Database connection failed");
    mockPostRepository.create.mockRejectedValue(error);

    await expect(createPostUseCase.execute(postData)).rejects.toThrow(
      "Database connection failed"
    );
    expect(mockPostRepository.create).toHaveBeenCalledTimes(1);
    expect(mockPostRepository.create).toHaveBeenCalledWith(postData);
  });
});
