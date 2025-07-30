import { DeletePostUseCase } from "@/use-cases/delete-post";
import { makeDeletePostUseCase } from "@/use-cases/factory/make-delete-post-use-case";
import { describe, expect, test } from "vitest";

describe("makeDeletePostUseCase", () => {
  test("should create a DeletePostUseCase instance", () => {
    const useCase = makeDeletePostUseCase();

    expect(useCase).toBeInstanceOf(DeletePostUseCase);
  });

  test("should return different instances on multiple calls", () => {
    const useCase1 = makeDeletePostUseCase();
    const useCase2 = makeDeletePostUseCase();

    expect(useCase1).not.toBe(useCase2);
  });
});
