import { PostRepository } from "@/repositories/pg/post.repository";
import { SearchQueryStringUseCase } from "@/use-cases/search-post";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const registerQuerySchema = z.object({
    query: z.string().min(1, "Query parameter is required"),
  });

  try {
    const { query } = registerQuerySchema.parse(request.query);
    const postRepository = new PostRepository();
    const createSearchUseCase = new SearchQueryStringUseCase(postRepository);
    const post = await createSearchUseCase.handler(query);
    if (!post || (Array.isArray(post) && post.length === 0)) {
      return reply.status(404).send();
    }
    return reply.status(200).send(post);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        error: "Invalid query parameter",
        details: err.issues,
      });
    }
    console.error("Search error:", err);
    return reply.status(500).send();
  }
}

const searchQuerystringOpenApiSchema = {
  type: "object",
  properties: {
    q: {
      type: "string",
      description: "Search query string for post titles or content",
      minLength: 1,
    },
  },

  required: ["q"],
};

export const searchPostSchema = {
  summary: "Search for posts by title or content",
  tags: ["Posts"],
  querystring: searchQuerystringOpenApiSchema,
  response: {
    200: {
      type: "object",
      properties: {
        posts: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
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
    },
    400: {
      type: "object",
      properties: {
        message: { type: "string", example: "Validation error." },
        issues: {
          type: "object",
          description: "Details about validation errors from Zod",
        },
      },
    },
    500: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};
