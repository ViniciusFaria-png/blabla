import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { makeFindProfessorByNameUseCase } from "@/use-cases/factory/make-find-professor-by-name-use-case";
import { makeSigninUseCase } from "@/use-cases/factory/make-signin-use-case";
import { compare } from "bcryptjs";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function signin(request: FastifyRequest, reply: FastifyReply) {
  const signinBodySchema = z.object({
    email: z.string().email(),
    senha: z.string(),
  });

  try {
    const { email, senha } = signinBodySchema.parse(request.body);

    console.log("=== DEBUG SIGNIN ===");
    console.log("Email recebido:", email);
    console.log("Senha recebida:", senha);

    const signinUserUseCase = makeSigninUseCase();
    const user = await signinUserUseCase.handler(email);

    console.log("Usuário encontrado:", user ? "SIM" : "NÃO");
    
    if (!user) {
      console.log("Usuário não encontrado no banco");
      return reply.status(401).send({ message: "Email ou senha incorretos" });
    }

    console.log("Hash no banco:", user.senha);
    
    const doesPasswordMatch = await compare(senha, user.senha);
    console.log("Senha confere:", doesPasswordMatch);

    if (!doesPasswordMatch) {
      console.log("Senha não confere");
      return reply.status(401).send({ message: "Email ou senha incorretos" });
    }

    // Simplificar resposta inicialmente
    try {
      const findProfessorByNameUseCase = makeFindProfessorByNameUseCase();
      const professorName = await findProfessorByNameUseCase.handler(
        user.id ? user.id : 0
      );

      return reply.status(200).send({
        user_id: user.id,
        email: user.email,
        professorName: professorName,
        message: "Login realizado com sucesso"
      });
    } catch (professorError) {
      console.log("Erro ao buscar professor:", professorError);
      // Retornar sucesso mesmo sem professor
      return reply.status(200).send({
        user_id: user.id,
        email: user.email,
        message: "Login realizado com sucesso"
      });
    }

  } catch (error) {
    console.log("=== ERRO NO SIGNIN ===");
    console.log(error);
    
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: "Dados inválidos",
        issues: error.issues,
      });
    }
    
    return reply.status(500).send({ 
      message: "Erro interno do servidor",
      error: error instanceof Error ? error.message : "Erro desconhecido"
    });
  }
}