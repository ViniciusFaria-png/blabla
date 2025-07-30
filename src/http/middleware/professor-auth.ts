import { FastifyReply, FastifyRequest } from "fastify";

export async function professorAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
    
    const payload = request.user as any;
    
    // Verificar se o usuário é professor e tem professorId válido
    if (!payload.isProfessor || !payload.professorId) {
      return reply.status(403).send({ 
        message: "Acesso negado. Apenas professores podem realizar esta ação." 
      });
    }

    // Adicionar dados do professor ao request para uso posterior
    request.user = {
      id: payload.sub,
      email: payload.email,
      professor_id: payload.professorId.toString()
    };

  } catch (error) {
    return reply.status(401).send({ 
      message: "Token inválido ou expirado" 
    });
  }
}