import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { makeFindProfessorByNameUseCase } from "@/use-cases/factory/make-find-professor-by-name-use-case";
import { makeSigninUseCase } from "@/use-cases/factory/make-signin-use-case";
import { compare, hash } from "bcryptjs";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function signin(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    email: z.string(),
    senha: z.string(),
  });

  const { email, senha } = registerBodySchema.parse(request.body);

  const signinUserUseCase = makeSigninUseCase();
  const user = await signinUserUseCase.handler(email);

  if (!user) {
    throw new InvalidCredentialsError();
  }

  console.log("Leia aqui vagabundo", user);
  console.log(await compare("senha_teste", user.senha));

  console.log("Senha recebida:", senha);
  console.log("Hash no banco:", user.senha);
  const senhaPura = "123456";

  (async () => {
    const senhaHasheada = await hash(senhaPura, 8);
    const confere = await compare(senhaPura, senhaHasheada);

    console.log({ senhaPura, senhaHasheada, confere });
  })();

  const doesPasswordMatch = await compare(senha, user.senha);

  if (!doesPasswordMatch) {
    throw new InvalidCredentialsError();
  }

  const token = await (reply as any).jwtSign({ email });

  const findProfessorByNameUseCase = makeFindProfessorByNameUseCase();
  const professorName = await findProfessorByNameUseCase.handler(
    user.id ? user.id : 0
  );

  return reply.status(200).send({
    user_id: user.id,
    professorName: professorName,
    token: token,
  });
}
