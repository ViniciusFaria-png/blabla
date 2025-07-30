import { vi } from "vitest";
import {
  mockPost,
  mockPostList,
  mockPostWithProfessor,
  mockProfessor,
  mockProfessorList,
  mockProfessorWithUser,
  mockUser,
  mockUserList,
} from "./entity-mocks";

export const mockUserRepository = {
  findAll: vi.fn().mockResolvedValue(mockUserList()),
  findById: vi.fn().mockResolvedValue(mockUser()),
  findByEmail: vi.fn().mockResolvedValue(mockUser()),
  create: vi.fn().mockResolvedValue(mockUser()),
  update: vi.fn().mockResolvedValue(mockUser()),
  delete: vi.fn().mockResolvedValue(true),
  exists: vi.fn().mockResolvedValue(true),
};

export const mockProfessorRepository = {
  findAll: vi.fn().mockResolvedValue(mockProfessorList()),
  findById: vi.fn().mockResolvedValue(mockProfessor()),
  findByUserId: vi.fn().mockResolvedValue(mockProfessor()),
  findByMateria: vi.fn().mockResolvedValue(mockProfessorList()),
  findWithUser: vi.fn().mockResolvedValue(mockProfessorWithUser()),
  create: vi.fn().mockResolvedValue(mockProfessor()),
  update: vi.fn().mockResolvedValue(mockProfessor()),
  delete: vi.fn().mockResolvedValue(true),
  exists: vi.fn().mockResolvedValue(true),
};

export const mockPostRepository = {
  findAll: vi.fn().mockResolvedValue(mockPostList()),
  findById: vi.fn().mockResolvedValue(mockPost()),
  findByProfessorId: vi.fn().mockResolvedValue(mockPostList()),
  findByTitleLike: vi.fn().mockResolvedValue(mockPostList()),
  findWithProfessor: vi.fn().mockResolvedValue(mockPostWithProfessor()),
  findAllWithProfessor: vi
    .fn()
    .mockResolvedValue(mockPostList().map(() => mockPostWithProfessor())),
  searchQueryString: vi.fn().mockResolvedValue(mockPostList()),
  create: vi.fn().mockResolvedValue(mockPost()),
  update: vi.fn().mockResolvedValue(mockPost()),
  delete: vi.fn().mockResolvedValue(true),
  exists: vi.fn().mockResolvedValue(true),
};

export const mockDatabase = {
  query: vi.fn(),
  connect: vi.fn().mockResolvedValue(undefined),
  disconnect: vi.fn().mockResolvedValue(undefined),
  transaction: vi.fn().mockImplementation(async (callback) => {
    return await callback(mockDatabase);
  }),
};

export const createRepositoryMock = <T>(mockEntity: T, mockList: T[]) => ({
  findAll: vi.fn().mockResolvedValue(mockList),
  findById: vi.fn().mockResolvedValue(mockEntity),
  create: vi.fn().mockResolvedValue(mockEntity),
  update: vi.fn().mockResolvedValue(mockEntity),
  delete: vi.fn().mockResolvedValue(true),
  exists: vi.fn().mockResolvedValue(true),
});

export const resetRepositoryMocks = () => {
  Object.values(mockUserRepository).forEach((mock) => {
    if (vi.isMockFunction(mock)) {
      mock.mockClear();
    }
  });
  Object.values(mockProfessorRepository).forEach((mock) => {
    if (vi.isMockFunction(mock)) {
      mock.mockClear();
    }
  });
  Object.values(mockPostRepository).forEach((mock) => {
    if (vi.isMockFunction(mock)) {
      mock.mockClear();
    }
  });
};

export const setupRepositoryScenarios = {
  notFound: () => {
    mockUserRepository.findById.mockResolvedValue(null);
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockProfessorRepository.findById.mockResolvedValue(null);
    mockPostRepository.findById.mockResolvedValue(null);
    mockPostRepository.searchQueryString.mockResolvedValue([]);
  },

  databaseError: () => {
    const error = new Error("Database connection failed");
    mockUserRepository.findById.mockRejectedValue(error);
    mockProfessorRepository.findById.mockRejectedValue(error);
    mockPostRepository.findById.mockRejectedValue(error);
    mockPostRepository.searchQueryString.mockRejectedValue(error);
  },

  conflict: () => {
    const error = new Error("Duplicate entry");
    mockUserRepository.create.mockRejectedValue(error);
    mockProfessorRepository.create.mockRejectedValue(error);
    mockPostRepository.create.mockRejectedValue(error);
  },

  default: () => {
    resetRepositoryMocks();
    mockUserRepository.findById.mockResolvedValue(mockUser());
    mockProfessorRepository.findById.mockResolvedValue(mockProfessor());
    mockPostRepository.findById.mockResolvedValue(mockPost());
    mockPostRepository.searchQueryString.mockResolvedValue(mockPostList());
  },
};
