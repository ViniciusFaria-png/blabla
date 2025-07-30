// src/http/controller/post/update.ts
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { makeUpdatePostUseCase } from "@/use-cases/factory/make-update-post-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const updatePostParamsSchema = z.object({
  id: z.string().uuid("Invalid post ID format."),
});

const updatePostBodySchema = z
  .object({
    titulo: z.string().min(1, "Title cannot be empty.").optional(),
    resumo: z.string().optional(),
    conteudo: z.string().min(1, "Content cannot be empty.").optional(),
    professor_id: z.number().int().positive().optional(),
  })
  .partial();

export async function update(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = updatePostParamsSchema.parse(request.params);
    const data = updatePostBodySchema.parse(request.body);
    const updatePostUseCase = makeUpdatePostUseCase();
    const { post } = await updatePostUseCase.execute({
      postId: id,
      ...data,
    });

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

export const updatePostSchema = {
  summary: "Update a post by ID",
  tags: ["Posts"],
  params: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
    },
    required: ["id"],
  },
  body: {
    type: "object",
    properties: {
      titulo: { type: "string", minLength: 1 },
      resumo: { type: "string" },
      conteudo: { type: "string", minLength: 1 },
      professor_id: { type: "number", minimum: 1 },
    },
    minProperties: 1,
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
