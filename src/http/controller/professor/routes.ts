import { FastifyInstance } from "fastify";
import { create, createTeacherSchema } from "./create";

export async function teacherRoutes(app: FastifyInstance) {
  app.post("/teacher", createTeacherSchema, create);
}
