import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { makeFindPostByIdUseCase } from "@/use-cases/factory/make-find-post-by-id-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const findPostParamsSchema = z.object({
  id: z.string().uuid("Invalid post ID format."),
});

export async function findById(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = findPostParamsSchema.parse(request.params);

    const findPostByIdUseCase = makeFindPostByIdUseCase();
    const { post } = await findPostByIdUseCase.execute({ postId: id });

    return reply.status(200).send({ post });
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

export const findByIdPostSchema = {
  summary: "Get a post by ID",
  tags: ["Posts"],
  params: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
    },
    required: ["id"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        post: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Generated UUID for the post",
            },
            titulo: { type: "string" },
            resumo: { type: "string", nullable: true },
            conteudo: { type: "string" },
            professor_id: { type: "number", format: "int32" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
          required: [
            "id",
            "titulo",
            "conteudo",
            "professor_id",
            "created_at",
            "updated_at",
          ],
        },
      },
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
