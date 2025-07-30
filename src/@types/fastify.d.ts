import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      id: string;
      professor_id: string;
      email?: string;
    };
  }
}
