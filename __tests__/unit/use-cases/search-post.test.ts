import { SearchQueryStringUseCase } from "@/use-cases/search-post";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockPostList } from "../../setup/mocks/entity-mocks";
import { mockPostRepository } from "../../setup/mocks/repository-mocks";

vi.mock("@/repositories/pg/post.repository", () => ({
  PostRepository: vi.fn().mockImplementation(() => mockPostRepository),
}));

describe("SearchQueryStringUseCase Unit Tests", () => {
  let searchUseCase: SearchQueryStringUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    searchUseCase = new SearchQueryStringUseCase(mockPostRepository);
  });

  it("should return posts when repository finds them", async () => {
    const query = "test";
    const expectedPosts = mockPostList();
    mockPostRepository.searchQueryString.mockResolvedValue(expectedPosts);

    const result = await searchUseCase.handler(query);

    expect(result).toEqual(expectedPosts);
    expect(mockPostRepository.searchQueryString).toHaveBeenCalledTimes(1);
    expect(mockPostRepository.searchQueryString).toHaveBeenCalledWith(query);
  });

  it("should return an empty array when repository finds no posts", async () => {
    const query = "nonexistent";
    mockPostRepository.searchQueryString.mockResolvedValue([]);

    const result = await searchUseCase.handler(query);

    expect(result).toEqual([]);
    expect(mockPostRepository.searchQueryString).toHaveBeenCalledTimes(1);
    expect(mockPostRepository.searchQueryString).toHaveBeenCalledWith(query);
  });

  it("should throw error when repository throws error", async () => {
    const query = "test";
    const error = new Error("Database error");
    mockPostRepository.searchQueryString.mockRejectedValue(error);

    await expect(searchUseCase.handler(query)).rejects.toThrow(
      "Database error"
    );
    expect(mockPostRepository.searchQueryString).toHaveBeenCalledTimes(1);
    expect(mockPostRepository.searchQueryString).toHaveBeenCalledWith(query);
  });
});
