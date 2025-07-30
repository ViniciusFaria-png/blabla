import { db } from "@/lib/db";
import Fastify from "fastify";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { postRoutes } from "../../src/http/controller/post/routes";

const fastify = Fastify();

describe("Integration Tests for Post Search API", () => {
  beforeAll(async () => {
    fastify.register(postRoutes);
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
    if (db.clientInstance) {
      await db.clientInstance.release();
    }
  });

  test("should return 200 and a list of posts for a valid query", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/posts/search?query=Químicas", 
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty("id");
    expect(body[0]).toHaveProperty("titulo");
    expect(body[0].titulo).toContain("Químicas");
  });

  test("should return 404 for a query with no results", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/posts/search?query=nonexistentquery123",
    });
    expect(response.statusCode).toBe(404);
  });

  test("should return 400 for a missing query parameter", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/posts/search",
    });
    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.payload);
    expect(body).toHaveProperty("error");
    expect(body.error).toBe("Invalid query parameter");
  });

  test("should return 500 for an internal server error during search", async () => {});
});
