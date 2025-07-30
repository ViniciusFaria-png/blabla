import { db } from "@/lib/db";
import Fastify from "fastify";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { postRoutes } from "../../src/http/controller/post/routes";
import { fakeAuth } from "../utils/fake-auth";

const fastify = Fastify();

describe("Integration - POST /posts (create)", () => {
  beforeAll(async () => {
    await fastify.register(fakeAuth);
    await fastify.register(postRoutes);
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
    if (db.clientInstance) await db.clientInstance.release();
  });

  test("should return 201 and the created post", async () => {
    const payload = {
      titulo: "Post de teste",
      resumo: "Resumo opcional",
      conteudo: "Conteúdo do post",
    };

    const response = await fastify.inject({
      method: "POST",
      url: "/posts",
      payload,
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.payload);

    expect(body).toHaveProperty("post");
    expect(body.post).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        titulo: payload.titulo,
        resumo: payload.resumo,
        conteudo: payload.conteudo,
        professor_id: expect.any(Number),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    );
  });

  test("should return 400 when body is invalid", async () => {
    const response = await fastify.inject({
      method: "POST",
      url: "/posts",
      payload: {
        titulo: "",
        conteudo: "conteudo",
      },
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.payload);
    expect(body).toHaveProperty(
      "message",
      "body/titulo must NOT have fewer than 1 characters"
    );
  });

  test("should return 400 when titulo is missing", async () => {
    const response = await fastify.inject({
      method: "POST",
      url: "/posts",
      payload: {
        conteudo: "conteudo",
      },
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.payload);
    expect(body).toHaveProperty(
      "message",
      "body must have required property 'titulo'"
    );
  });

  test("should return 400 when conteudo is missing", async () => {
    const response = await fastify.inject({
      method: "POST",
      url: "/posts",
      payload: {
        titulo: "Título do post",
      },
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.payload);
    expect(body).toHaveProperty(
      "message",
      "body must have required property 'conteudo'"
    );
  });
});
