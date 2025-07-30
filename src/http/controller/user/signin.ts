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

    const signinUserUseCase = makeSigninUseCase();
    const user = await signinUserUseCase.handler(email);

    if (!user) {
      return reply.status(401).send({ message: "Email ou senha incorretos" });
    }

    const doesPasswordMatch = await compare(senha, user.senha);

    if (!doesPasswordMatch) {
      return reply.status(401).send({ message: "Email ou senha incorretos" });
    }

    // Buscar dados do professor
    const findProfessorByNameUseCase = makeFindProfessorByNameUseCase();
    let professorData = null;

    try {
      const professorName = await findProfessorByNameUseCase.handler(
        user.id || 0
      );
      // Buscar o ID do professor também
      const professorId = await findProfessorByNameUseCase.getProfessorId(
        user.id || 0
      );

      professorData = {
        name: professorName,
        id: professorId,
      };
    } catch (professorError) {
      console.log("Professor não encontrado para este usuário");
    }

    // Gerar JWT token
    const token = await reply.jwtSign(
      {
        sub: user.id,
        email: user.email,
        professorId: professorData?.id || null,
        isProfessor: !!professorData,
      },
      {
        expiresIn: "7d",
      }
    );

    return reply.status(200).send({
      user: {
        id: user.id,
        email: user.email,
        professorName: professorData?.name,
        isProfessor: !!professorData,
      },
      token,
      message: "Login realizado com sucesso",
    });
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
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
}

export const signinSchema = {
  summary: "User authentication",
  tags: ["Auth"],
  body: {
    type: "object",
    properties: {
      email: { type: "string", format: "email" },
      senha: { type: "string", minLength: 1 },
    },
    required: ["email", "senha"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: {
            id: { type: "number" },
            email: { type: "string" },
            professorName: { type: "string", nullable: true },
            isProfessor: { type: "boolean" },
          },
        },
        token: { type: "string" },
        message: { type: "string" },
      },
    },
    401: {
      type: "object",
      properties: {
        message: { type: "string", example: "Email ou senha incorretos" },
      },
    },
  },
};
