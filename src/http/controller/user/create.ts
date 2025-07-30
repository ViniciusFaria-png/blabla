import { makeCreateUserUseCase } from "@/use-cases/factory/make-create-user-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    email: z.string().email(),
    senha: z.string().min(6),
  });

  const { email, senha } = registerBodySchema.parse(request.body);

  // Remover o hash daqui - deixar apenas no use case
  const createUserUseCase = makeCreateUserUseCase();
  const user = await createUserUseCase.handler({ email, senha });

  return reply.status(201).send({ id: user?.id, email: user?.email });
}