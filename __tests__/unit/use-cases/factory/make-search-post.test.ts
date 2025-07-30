import { describe, expect, test } from 'vitest';
import { makeSearchPostUseCase } from '@/use-cases/factory/make-search-post-use-case';
import { SearchQueryStringUseCase } from '@/use-cases/search-post';

describe('makeSearchPostUseCase', () => {
  test('should create SearchQueryStringUseCase instance', () => {
    const useCase = makeSearchPostUseCase();
    
    expect(useCase).toBeInstanceOf(SearchQueryStringUseCase);
  });

  test('should return different instances on multiple calls', () => {
    const useCase1 = makeSearchPostUseCase();
    const useCase2 = makeSearchPostUseCase();
    
    expect(useCase1).not.toBe(useCase2);
  });
});