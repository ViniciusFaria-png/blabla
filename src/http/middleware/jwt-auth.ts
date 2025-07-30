import { FastifyReply, FastifyRequest } from "fastify";

export async function jwtAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    return reply.status(401).send({ 
      message: "Token inválido ou expirado" 
    });
  }
}