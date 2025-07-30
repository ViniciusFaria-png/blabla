import { makeFindAllPostsUseCase } from "@/use-cases/factory/make-find-all-posts-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

export async function findAll(request: FastifyRequest, reply: FastifyReply) {
  try {
    const findAllPostsUseCase = makeFindAllPostsUseCase();
    const { posts } = await findAllPostsUseCase.execute();

    return reply.status(200).send({ posts });
  } catch (err) {
    throw err;
  }
}

export const findAllPostsSchema = {
  summary: "Retrieve all posts",
  tags: ["Posts"],
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
              professor_id: { type: "number" },
              created_at: { type: "string", format: "date-time" },
              updated_at: { type: "string", format: "date-time" },
            },
          },
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
