import { FastifyInstance } from "fastify";
import { create, createUserSchema } from "./create";
import { signin } from "./signin";

export async function userRoutes(app: FastifyInstance) {
  app.post("/user", { ...createUserSchema }, create);
  app.post("/user/signin", signin);
}
