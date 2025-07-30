import { makeCreateUserUseCase } from "@/use-cases/factory/make-create-user-use-case";
import { hash } from "bcryptjs";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    email: z.string(),
    senha: z.string(),
  });

  const { email, senha } = registerBodySchema.parse(request.body);

  const hashedPassword = await hash(senha, 8);

  const userWithHashedPassword = { email, senha: hashedPassword };

  const createUserUseCase = makeCreateUserUseCase();

  const user = await createUserUseCase.handler(userWithHashedPassword);

  return reply.status(201).send({ id: user?.id, email: user?.email });
}

export const createUserSchema = {
  schema: {
    summary: "User creation",
    description: "This method uncludes a new user",
    tags: ["v1"],
    body: {
      type: "object",
      required: ["email", "senha"],
      properties: {
        email: { type: "string" },
        senha: { type: "string", format: "password" },
      },
    },

    response: {
      201: {
        description: "Successful response",
        type: "object",
        properties: {
          id: { type: "number" },
          email: { type: "string" },
        },
      },
    },
  },
};
