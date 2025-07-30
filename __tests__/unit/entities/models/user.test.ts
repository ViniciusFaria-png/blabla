import { IUser } from "@/entities/models/user.interface";
import { describe, expect, test } from "vitest";
import { mockUser } from "../../../setup/mocks/entity-mocks";

describe("User Entity", () => {
  test("should create a valid user with required fields", () => {
    const user: IUser = mockUser();

    expect(user).toBeDefined();
    expect(user.id).toBe(1);
    expect(user.email).toBe("test@fiap.com");
    expect(user.senha).toBe("hashed_password_123");
  });

  test("should create user with overrides", () => {
    const user: IUser = mockUser({
      id: 999,
      email: "custom@test.com",
    });

    expect(user.id).toBe(999);
    expect(user.email).toBe("custom@test.com");
    expect(user.senha).toBe("hashed_password_123");
  });

  test("should have all required properties", () => {
    const user: IUser = mockUser();

    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("email");
    expect(user).toHaveProperty("senha");
  });
});
