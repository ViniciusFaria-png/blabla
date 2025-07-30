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

describe("Integration - GET /posts/:id (find by id)", () => {
  let createdId: string;

  beforeAll(async () => {
    await fastify.register(fakeAuth);
    fastify.register(postRoutes);
    await fastify.ready();

    const { rows } = await db.query("SELECT id FROM professor LIMIT 1");
    const professorId = rows[0].id;

    const post = await createPost({
      titulo: "Post único",
      conteudo: "Conteúdo",
    });
    createdId = post.id;
  });

  afterAll(async () => {
    await fastify.close();
    if (db.clientInstance) await db.clientInstance.release();
  });

  test("should return 200 and the post", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: `/posts/${createdId}`,
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body).toHaveProperty("post");
    expect(body.post).toEqual(
      expect.objectContaining({
        id: createdId,
        titulo: "Post único",
      })
    );
  });

  test("should return 404 if post not found", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: `/posts/00000000-0000-0000-0000-000000000000`,
    });

    expect(response.statusCode).toBe(404);
  });

  test("should return 400 if id is invalid", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: `/posts/invalid-uuid`,
    });

    expect(response.statusCode).toBe(400);
  });
});
