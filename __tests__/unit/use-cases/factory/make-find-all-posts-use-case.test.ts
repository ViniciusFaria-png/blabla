import { describe, expect, test } from 'vitest';
import { makeFindAllPostsUseCase } from '@/use-cases/factory/make-find-all-posts-use-case';
import { FindAllPostsUseCase } from '@/use-cases/find-all-posts';

describe('makeFindAllPostsUseCase', () => {
  test('should create FindAllPostsUseCase instance', () => {
    const useCase = makeFindAllPostsUseCase();
    
    expect(useCase).toBeInstanceOf(FindAllPostsUseCase);
  });

  test('should return different instances on multiple calls', () => {
    const useCase1 = makeFindAllPostsUseCase();
    const useCase2 = makeFindAllPostsUseCase();
    
    expect(useCase1).not.toBe(useCase2);
  });
});