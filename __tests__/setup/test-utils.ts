import { FastifyReply, FastifyRequest } from "fastify";
import { vi } from "vitest";

export const mockRequest = (overrides: any = {}): Partial<FastifyRequest> => {
  return {
    params: {},
    query: {},
    body: {},
    headers: {},
    user: undefined,
    ...overrides,
  };
};

export const mockReply = (): any => {
  const reply = {
    status: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
    code: vi.fn().mockReturnThis(),
    setCookie: vi.fn().mockReturnThis(),
    clearCookie: vi.fn().mockReturnThis(),
    header: vi.fn().mockReturnThis(),
  };
  return reply;
};

export const mockNext = vi.fn();

export const createAsyncMock = <T>(returnValue?: T) => {
  return vi.fn().mockResolvedValue(returnValue);
};

export const createAsyncErrorMock = (error: Error) => {
  return vi.fn().mockRejectedValue(error);
};

export const generateTestId = (prefix: string = "test"): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateTestUUID = (): string => {
  return "550e8400-e29b-41d4-a716-446655440000";
};

export const createTestDate = (offset: number = 0): Date => {
  return new Date(new Date("2024-01-01T00:00:00.000Z").getTime() + offset);
};
