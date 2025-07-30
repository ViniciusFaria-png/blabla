import { remove } from "@/http/controller/post/delete";
import { DeletePostUseCase } from "@/use-cases/delete-post";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { makeDeletePostUseCase } from "@/use-cases/factory/make-delete-post-use-case";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockPostRepository } from "../../../../setup/mocks/repository-mocks";
import {
  generateTestUUID,
  mockReply,
  mockRequest,
} from "../../../../setup/test-utils";

vi.mock("@/use-cases/factory/make-delete-post-use-case", () => ({
  makeDeletePostUseCase: vi.fn(),
}));

describe("Delete Post Controller", () => {
  let request: any;
  let reply: any;
  let deletePostUseCaseMock: DeletePostUseCase;
  const postId = generateTestUUID();

  beforeEach(() => {
    request = mockRequest();
    reply = mockReply();
    deletePostUseCaseMock = new DeletePostUseCase(mockPostRepository);

    vi.mocked(makeDeletePostUseCase).mockReturnValue(deletePostUseCaseMock);
  });

  it("should return 204 on successful deletion", async () => {
    request.params = { id: postId };
    vi.spyOn(deletePostUseCaseMock, "execute").mockResolvedValue(undefined);

    await remove(request, reply);

    expect(reply.status).toHaveBeenCalledWith(204);
    expect(reply.send).toHaveBeenCalledWith();
    expect(deletePostUseCaseMock.execute).toHaveBeenCalledWith({
      postId,
    });
  });

  it("should return 404 if post not found", async () => {
    request.params = { id: postId };
    vi.spyOn(deletePostUseCaseMock, "execute").mockRejectedValue(
      new ResourceNotFoundError()
    );

    await remove(request, reply);

    expect(reply.status).toHaveBeenCalledWith(404);
    expect(reply.send).toHaveBeenCalledWith({ message: "Resource not found" });
  });

  it("should return 400 if validation fails (invalid post ID format)", async () => {
    request.params = { id: "invalid-uuid" };

    const executeSpy = vi.spyOn(deletePostUseCaseMock, "execute"); // <— torne-o um spy

    await remove(request, reply);

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

    expect(executeSpy).not.toHaveBeenCalled();
  });

  it("should throw error if use case throws unexpected error", async () => {
    const error = new Error("Something went wrong");
    request.params = { id: postId };
    vi.spyOn(deletePostUseCaseMock, "execute").mockRejectedValue(error);

    await expect(remove(request, reply)).rejects.toThrow(error);
  });
});
