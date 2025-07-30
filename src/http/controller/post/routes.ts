import { professorAuth } from "@/http/middleware/professor-auth";
import { FastifyInstance } from "fastify";
import { create, createPostSchema } from "./create";
import { deletePostSchema, remove } from "./delete";
import { findAll, findAllPostsSchema } from "./find-all";
import { findById, findByIdPostSchema } from "./find-by-id";
import { search } from "./search";
import { update, updatePostSchema } from "./update";

export async function postRoutes(app: FastifyInstance) {
  app.get("/posts/search", search);

  app.get("/posts/:id", { schema: findByIdPostSchema }, findById);

  app.get("/posts", { schema: findAllPostsSchema }, findAll);

  app.post(
    "/posts",
    {
      preHandler: [professorAuth],
      schema: createPostSchema,
    },
    create
  );

  app.put(
    "/posts/:id",
    {
      preHandler: [professorAuth],
      schema: updatePostSchema,
    },
    update
  );

  app.delete(
    "/posts/:id",
    {
      preHandler: [professorAuth],
      schema: deletePostSchema,
    },
    remove
  );
}
