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

describe("Integration - GET /posts (find all)", () => {
  let professorId: string;

  beforeAll(async () => {
    await fastify.register(fakeAuth);
    fastify.register(postRoutes);
    await fastify.ready();

    const { rows } = await db.query("SELECT id FROM professor LIMIT 1");
    professorId = rows[0].id;

    await createPost({
      titulo: "Um post",
      conteudo: "A",
    });
    await createPost({
      titulo: "Outro post",
      conteudo: "B",
    });
  });

  afterAll(async () => {
    await fastify.close();
    if (db.clientInstance) await db.clientInstance.release();
  });

  test("should return 200 and an object with posts array", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/posts",
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);

    expect(body).toHaveProperty("posts");
    expect(Array.isArray(body.posts)).toBe(true);
    expect(body.posts.length).toBeGreaterThanOrEqual(2);
    expect(body.posts[0]).toHaveProperty("id");
    expect(body.posts[0]).toHaveProperty("titulo");
  });
});
