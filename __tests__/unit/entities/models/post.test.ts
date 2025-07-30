import { IPost } from "@/entities/models/post.interface";
import { describe, expect, test } from "vitest";
import { mockPost } from "../../../setup/mocks/entity-mocks";

describe("Post Entity", () => {
  test("should create a valid post with required fields", () => {
    const post: IPost = mockPost();

    expect(post).toBeDefined();
    expect(post.id).toBeDefined();
    expect(post.titulo).toBe("Post de Teste");
    expect(post.resumo).toBe("Este é um resumo de teste para o post.");
    expect(post.conteudo).toBeDefined();
    expect(post.professor_id).toBe(1);
    expect(post.created_at).toBeInstanceOf(Date);
    expect(post.updated_at).toBeInstanceOf(Date);
  });

  test("should create post with overrides", () => {
    const customTitle = "Custom Title";
    const post: IPost = mockPost({ titulo: customTitle });

    expect(post.titulo).toBe(customTitle);
    expect(post.resumo).toBe("Este é um resumo de teste para o post.");
  });

  test("should have all required properties", () => {
    const post: IPost = mockPost();

    expect(post).toHaveProperty("id");
    expect(post).toHaveProperty("titulo");
    expect(post).toHaveProperty("resumo");
    expect(post).toHaveProperty("conteudo");
    expect(post).toHaveProperty("professor_id");
    expect(post).toHaveProperty("created_at");
    expect(post).toHaveProperty("updated_at");
  });
});
