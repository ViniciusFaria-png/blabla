import { FastifyInstance } from "fastify";
import { findAll, findAllPostsSchema } from "./find-all";
import { search } from "./search";
import { findById, findByIdPostSchema } from "./find-by-id";
import { create, createPostSchema } from "./create";
import { update, updatePostSchema } from "./update";
import { deletePostSchema, remove } from "./delete";

export async function postRoutes(app: FastifyInstance) {
  app.get("/posts/search", search);
  app.post("/posts", { schema: createPostSchema }, create);

  app.get("/posts/:id", { schema: findByIdPostSchema }, findById);

  app.get("/posts", { schema: findAllPostsSchema }, findAll);

  app.put("/posts/:id", { schema: updatePostSchema }, update);

  app.delete("/posts/:id", { schema: deletePostSchema }, remove);
  
}
