import { makeUpdatePostUseCase } from "@/use-cases/factory/make-update-post-use-case";
import { UpdatePostUseCase } from "@/use-cases/update-post";
import { describe, expect, test } from "vitest";

describe("makeUpdatePostUseCase", () => {
  test("should create an UpdatePostUseCase instance", () => {
    const useCase = makeUpdatePostUseCase();

    expect(useCase).toBeInstanceOf(UpdatePostUseCase);
  });

  test("should return different instances on multiple calls", () => {
    const useCase1 = makeUpdatePostUseCase();
    const useCase2 = makeUpdatePostUseCase();

    expect(useCase1).not.toBe(useCase2);
  });
});
