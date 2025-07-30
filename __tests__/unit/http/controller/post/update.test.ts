import { update } from "@/http/controller/post/update";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { makeUpdatePostUseCase } from "@/use-cases/factory/make-update-post-use-case";
import { UpdatePostUseCase } from "@/use-cases/update-post";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockPost } from "../../../../setup/mocks/entity-mocks";
import { mockPostRepository } from "../../../../setup/mocks/repository-mocks";
import {
  generateTestUUID,
  mockReply,
  mockRequest,
} from "../../../../setup/test-utils";

vi.mock("@/use-cases/factory/make-update-post-use-case", () => ({
  makeUpdatePostUseCase: vi.fn(),
}));

describe("Update Post Controller", () => {
  let request: any;
  let reply: any;
  let updatePostUseCaseMock: UpdatePostUseCase;
  const postId = generateTestUUID();

  beforeEach(() => {
    request = mockRequest();
    reply = mockReply();
    updatePostUseCaseMock = new UpdatePostUseCase(mockPostRepository);

    vi.spyOn(updatePostUseCaseMock, "execute");

    vi.mocked(makeUpdatePostUseCase).mockReturnValue(updatePostUseCaseMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return 200 and the updated post on successful update", async () => {
    const updateData = {
      titulo: "Updated Title",
      resumo: "Updated Summary",
    };
    const updatedPost = mockPost({ id: postId, ...updateData });

    request.params = { id: postId };
    request.body = updateData;
    vi.mocked(updatePostUseCaseMock.execute).mockResolvedValue({
      post: updatedPost,
    });

    await update(request, reply);

    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith({ post: updatedPost });
    expect(updatePostUseCaseMock.execute).toHaveBeenCalledWith({
      postId,
      ...updateData,
    });
  });

  it("should return 404 if post not found", async () => {
    request.params = { id: postId };
    request.body = { titulo: "Updated Title" };
    vi.mocked(updatePostUseCaseMock.execute).mockRejectedValue(
      new ResourceNotFoundError()
    );

    await update(request, reply);

    expect(reply.status).toHaveBeenCalledWith(404);
    expect(reply.send).toHaveBeenCalledWith({ message: "Resource not found" });
  });

  it("should return 400 if validation fails (invalid post ID format)", async () => {
    request.params = { id: "invalid-uuid" };
    request.body = { titulo: "Updated Title" };

    await update(request, reply);

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
    expect(updatePostUseCaseMock.execute).not.toHaveBeenCalled();
  });

  it("should return 400 if validation fails (invalid body field type)", async () => {
    request.params = { id: postId };
    request.body = { professor_id: "not-a-number" };

    await update(request, reply);

    expect(reply.status).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Validation error.",
        issues: expect.arrayContaining([
          expect.objectContaining({
            path: ["professor_id"],
            message: expect.any(String),
          }),
        ]),
      })
    );
    expect(updatePostUseCaseMock.execute).not.toHaveBeenCalled();
  });

  it("should throw error if use case throws unexpected error", async () => {
    const error = new Error("Something went wrong");
    request.params = { id: postId };
    request.body = { titulo: "Updated Title" };
    vi.mocked(updatePostUseCaseMock.execute).mockRejectedValue(error);

    await expect(update(request, reply)).rejects.toThrow(error);
  });
});
