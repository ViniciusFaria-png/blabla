
import { makeCreateProfessorUseCase } from "@/use-cases/factory/make-create-professor-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    nome: z.string(),
    materia: z.string(),
    user_id: z.coerce.number().optional(),
  });

  const { nome, materia, user_id } = registerBodySchema.parse(
    request.body
  );

  const createTeacherUseCase = makeCreateProfessorUseCase();
  const teacher = await createTeacherUseCase.handler({
    nome,
    materia,
    user_id,
  });

  reply.status(201).send({
    id: teacher.id,
    nome: teacher.nome,
    materia: teacher.materia,
  });
}

export const createTeacherSchema = {
  schema: {
    summary: "Teacher creation",
    description: "This method uncludes a new teacher",
    tags: ["v1"],
    body: {
      type: "object",
      required: ["name", "school_subject"],
      properties: {
        name: { type: "string" },
        school_subject: { type: "string" },
        user_id: { type: "number" },
      },
    },
    response: {
      201: {
        description: "Successful response",
        type: "object",
        properties: {
          id: { type: "number" },
          name: { type: "string" },
          school_subject: { type: "string" },
        },
      },
    },
  },
};
