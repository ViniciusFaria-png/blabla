import { findById } from "@/http/controller/post/find-by-id";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { makeFindPostByIdUseCase } from "@/use-cases/factory/make-find-post-by-id-use-case";
import { FindPostByIdUseCase } from "@/use-cases/find-post-by-id";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockPost } from "../../../../setup/mocks/entity-mocks";
import { mockPostRepository } from "../../../../setup/mocks/repository-mocks";
import {
  generateTestUUID,
  mockReply,
  mockRequest,
} from "../../../../setup/test-utils";

vi.mock("@/use-cases/factory/make-find-post-by-id-use-case", () => ({
  makeFindPostByIdUseCase: vi.fn(),
}));

describe("Find Post By ID Controller", () => {
  let request: any;
  let reply: any;
  let findPostByIdUseCaseMock: FindPostByIdUseCase;
  const postId = generateTestUUID();

  beforeEach(() => {
    request = mockRequest();
    reply = mockReply();
    findPostByIdUseCaseMock = new FindPostByIdUseCase(mockPostRepository);

    vi.mocked(makeFindPostByIdUseCase).mockReturnValue(findPostByIdUseCaseMock);
  });

  it("should return 200 and the post when a valid ID is provided", async () => {
    const expectedPost = mockPost({ id: postId });

    request.params = { id: postId };
    vi.spyOn(findPostByIdUseCaseMock, "execute").mockResolvedValue({
      post: expectedPost,
    });

    await findById(request, reply);

    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith({ post: expectedPost });
    expect(findPostByIdUseCaseMock.execute).toHaveBeenCalledWith({ postId });
  });

  it("should return 404 if post not found", async () => {
    request.params = { id: postId };
    vi.spyOn(findPostByIdUseCaseMock, "execute").mockRejectedValue(
      new ResourceNotFoundError()
    );

    await findById(request, reply);

    expect(reply.status).toHaveBeenCalledWith(404);
    expect(reply.send).toHaveBeenCalledWith({ message: "Resource not found" });
  });

  it("should return 400 if validation fails (invalid post ID format)", async () => {
    request.params = { id: "invalid-uuid" };
    const executeSpy = vi.spyOn(findPostByIdUseCaseMock, "execute");

    await findById(request, reply);

    expect(reply.status).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Validation error.",
        issues: expect.arrayContaining([
          expect.objectContaining({
            path: ["id"],
            message: "Invalid post ID format.",
          }),
        ]),
      })
    );
    expect(findPostByIdUseCaseMock.execute).not.toHaveBeenCalled();
  });

  it("should throw error if use case throws unexpected error", async () => {
    const error = new Error("Something went wrong");
    request.params = { id: postId };
    vi.spyOn(findPostByIdUseCaseMock, "execute").mockRejectedValue(error);

    await expect(findById(request, reply)).rejects.toThrow(error);
  });
});
