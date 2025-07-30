import { db } from "@/lib/db";
import fp from "fastify-plugin";

export const fakeAuth = fp(
  async function fakeAuth(fastify) {
    const { rows } = await db.query("SELECT id FROM professor LIMIT 1");
    const professorId = rows[0].id;

    fastify.decorateRequest("user", undefined);

    fastify.addHook("preHandler", async (req) => {
      req.user = {
        id: "fake-user-id",
        professor_id: professorId,
        email: "test@example.com",
      };
    });
  },
  { name: "fakeAuth" }
);
