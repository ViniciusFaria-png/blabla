import { db } from "@/lib/db";
import { fakeAuth } from "__tests__/utils/fake-auth";
import Fastify from "fastify";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { postRoutes } from "../../src/http/controller/post/routes";

const fastify = Fastify();

async function createPost(data: {
  titulo: string;
  resumo?: string;
  conteudo: string;
}) {
  const res = await fastify.inject({
    method: "POST",
    url: "/posts",
    payload: data,
  });
  return JSON.parse(res.payload).post;
}

describe("Integration - PUT /posts/:id (update)", () => {
  let createdId: string;

  beforeAll(async () => {
    await fastify.register(fakeAuth);
    fastify.register(postRoutes);
    await fastify.ready();

    const { rows } = await db.query("SELECT id FROM professor LIMIT 1");
    const professorId = rows[0].id;

    const post = await createPost({
      titulo: "Título original",
      conteudo: "Conteúdo original",
    });
    createdId = post.id;
  });

  afterAll(async () => {
    await fastify.close();
    if (db.clientInstance) await db.clientInstance.release();
  });

  test("should return 200 and the updated post", async () => {
    const payload = {
      titulo: "Título atualizado",
      conteudo: "Conteúdo atualizado",
    };

    const response = await fastify.inject({
      method: "PUT",
      url: `/posts/${createdId}`,
      payload,
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);

    expect(body).toHaveProperty("post");
    expect(body.post).toEqual(
      expect.objectContaining({
        id: createdId,
        titulo: payload.titulo,
        conteudo: payload.conteudo,
      })
    );
  });

  test("should return 404 if post does not exist", async () => {
    const response = await fastify.inject({
      method: "PUT",
      url: `/posts/00000000-0000-0000-0000-000000000000`,
      payload: {
        titulo: "Nada",
      },
    });

    expect(response.statusCode).toBe(404);
  });

  test("should return 400 for invalid id format", async () => {
    const response = await fastify.inject({
      method: "PUT",
      url: `/posts/invalid-uuid`,
      payload: {
        titulo: "x",
      },
    });

    expect(response.statusCode).toBe(400);
  });

  test("should return 400 when body is empty (no fields to update)", async () => {
    const response = await fastify.inject({
      method: "PUT",
      url: `/posts/${createdId}`,
      payload: {},
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.payload);
    expect(body).toHaveProperty("message");
    expect(body.message).toContain("must NOT have fewer than 1 properties");
  });
});
