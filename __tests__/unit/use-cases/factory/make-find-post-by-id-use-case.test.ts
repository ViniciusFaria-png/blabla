import { makeFindPostByIdUseCase } from "@/use-cases/factory/make-find-post-by-id-use-case";
import { FindPostByIdUseCase } from "@/use-cases/find-post-by-id";
import { describe, expect, test } from "vitest";

describe("makeFindPostByIdUseCase", () => {
  test("should create a FindPostByIdUseCase instance", () => {
    const useCase = makeFindPostByIdUseCase();

    expect(useCase).toBeInstanceOf(FindPostByIdUseCase);
  });

  test("should return different instances on multiple calls", () => {
    const useCase1 = makeFindPostByIdUseCase();
    const useCase2 = makeFindPostByIdUseCase();

    expect(useCase1).not.toBe(useCase2);
  });
});
