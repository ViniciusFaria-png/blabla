import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { makeDeletePostUseCase } from "@/use-cases/factory/make-delete-post-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const deletePostParamsSchema = z.object({
  id: z.string().uuid("Invalid post ID format."),
});

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = deletePostParamsSchema.parse(request.params);

    const deletePostUseCase = makeDeletePostUseCase();
    await deletePostUseCase.execute({ postId: id });

    return reply.status(204).send();
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        message: "Validation error.",
        issues: err.issues,
      });
    }
    throw err;
  }
}

export const deletePostSchema = {
  summary: "Delete a post by ID",
  tags: ["Posts"],
  params: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
    },
    required: ["id"],
  },
  response: {
    204: {
      type: "null",
      description: "No content",
    },
    400: {
      type: "object",
      properties: {
        message: { type: "string", example: "Validation error." },
        issues: {
          type: "array",
          items: {
            type: "object",
            properties: {
              code: { type: "string" },
              expected: { type: "string" },
              received: { type: "string" },
              path: { type: "array", items: { type: "string" } },
              message: { type: "string" },
            },
            required: ["code", "expected", "received", "path", "message"],
          },
        },
      },
    },
    404: {
      type: "object",
      properties: {
        message: { type: "string", example: "Resource not found" },
      },
    },
  },
};
