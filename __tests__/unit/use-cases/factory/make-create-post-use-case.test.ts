import { describe, expect, test } from "vitest";
import { makeCreatePostUseCase } from "@/use-cases/factory/make-create-post-use-case";
import { CreatePostUseCase } from "@/use-cases/create-post";

describe("makeCreatePostUseCase", () => {
  test("should create a CreatePostUseCase instance", () => {
    const useCase = makeCreatePostUseCase();

    expect(useCase).toBeInstanceOf(CreatePostUseCase);
  });

  test("should return different instances on multiple calls", () => {
    const useCase1 = makeCreatePostUseCase();
    const useCase2 = makeCreatePostUseCase();

    expect(useCase1).not.toBe(useCase2);
  });
});