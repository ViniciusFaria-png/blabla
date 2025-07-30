import { describe, expect, test } from 'vitest';
import { IProfessor } from '@/entities/models/professor.interface';
import { mockProfessor } from '../../../setup/mocks/entity-mocks';

describe('Professor Entity', () => {
  test('should create a valid professor with required fields', () => {
    const professor: IProfessor = mockProfessor();
    
    expect(professor).toBeDefined();
    expect(professor.id).toBe(1);
    expect(professor.nome).toBe('Professor Teste');
    expect(professor.materia).toBe('Matemática');
    expect(professor.user_id).toBe(1);
  });

  test('should create professor with overrides', () => {
    const professor: IProfessor = mockProfessor({ 
      nome: 'Custom Professor',
      materia: 'Física' 
    });
    
    expect(professor.nome).toBe('Custom Professor');
    expect(professor.materia).toBe('Física');
    expect(professor.id).toBe(1);
    expect(professor.user_id).toBe(1); 
  });

  test('should have all required properties', () => {
    const professor: IProfessor = mockProfessor();
    
    expect(professor).toHaveProperty('id');
    expect(professor).toHaveProperty('nome');
    expect(professor).toHaveProperty('materia');
    expect(professor).toHaveProperty('user_id');
  });
});