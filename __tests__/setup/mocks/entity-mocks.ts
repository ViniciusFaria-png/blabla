
import { IUser } from '@/entities/models/user.interface'
import { IProfessor } from '@/entities/models/professor.interface'
import { IPost } from '@/entities/models/post.interface'
import { createTestDate, generateTestUUID } from '../test-utils'

export const mockUser = (overrides: Partial<IUser> = {}): IUser => ({
  id: 1,
  email: 'test@fiap.com',
  senha: 'hashed_password_123',
  ...overrides,
})

export const mockUserList = (): IUser[] => [
  mockUser({ id: 1, email: 'quimica@fiap.com' }),
  mockUser({ id: 2, email: 'ingles@fiap.com' }),
  mockUser({ id: 3, email: 'portugues@fiap.com' }),
  mockUser({ id: 4, email: 'geografia@fiap.com' }),
]

export const mockProfessor = (overrides: Partial<IProfessor> = {}): IProfessor => ({
  id: 1,
  nome: 'Professor Teste',
  materia: 'Matemática',
  user_id: 1,
  ...overrides,
})

export const mockProfessorList = (): IProfessor[] => [
  mockProfessor({ id: 1, nome: 'Elvis Presley', materia: 'quimica', user_id: 1 }),
  mockProfessor({ id: 2, nome: 'Bon Scott', materia: 'ingles', user_id: 2 }),
  mockProfessor({ id: 3, nome: 'Jimmy Page', materia: 'portugues', user_id: 3 }),
  mockProfessor({ id: 4, nome: 'Lemmy Kilmister', materia: 'geografia', user_id: 4 }),
]

export const mockPost = (overrides: Partial<IPost> = {}): IPost => ({
  id: generateTestUUID(),
  titulo: 'Post de Teste',
  resumo: 'Este é um resumo de teste para o post.',
  conteudo: 'Este é o conteúdo completo do post de teste. Aqui temos mais detalhes e informações relevantes sobre o tópico abordado.',
  professor_id: 1,
  created_at: createTestDate(),
  updated_at: createTestDate(),
  ...overrides,
})

export const mockPostList = (): IPost[] => [
  mockPost({
    id: '550e8400-e29b-41d4-a716-446655440001',
    titulo: 'Ligações Químicas: O Poder da Atração Molecular',
    resumo: 'As ligações químicas são as forças que mantêm os átomos unidos.',
    professor_id: 1,
  }),
  mockPost({
    id: '550e8400-e29b-41d4-a716-446655440002',
    titulo: 'Phrasal Verbs: Dominando os Verbos Compostos do Inglês',
    resumo: 'Os phrasal verbs são combinações de verbos com preposições.',
    professor_id: 2,
  }),
  mockPost({
    id: '550e8400-e29b-41d4-a716-446655440003',
    titulo: 'A Riqueza dos Regionalismos na Língua Portuguesa',
    resumo: 'Os regionalismos são variações linguísticas que enriquecem o português.',
    professor_id: 3,
  }),
]

export const mockCreateUserData = (overrides: Partial<Omit<IUser, 'id'>> = {}) => ({
  email: 'novo@fiap.com',
  senha: 'senha123',
  ...overrides,
})

export const mockCreateProfessorData = (overrides: Partial<Omit<IProfessor, 'id'>> = {}) => ({
  nome: 'Novo Professor',
  materia: 'Nova Matéria',
  user_id: 1,
  ...overrides,
})

export const mockCreatePostData = (overrides: Partial<Omit<IPost, 'id' | 'created_at' | 'updated_at'>> = {}) => ({
  titulo: 'Novo Post',
  resumo: 'Resumo do novo post',
  conteudo: 'Conteúdo completo do novo post com informações detalhadas.',
  professor_id: 1,
  ...overrides,
})

export const mockPostWithProfessor = (overrides: any = {}) => ({
  ...mockPost(),
  professor: mockProfessor(),
  ...overrides,
})

export const mockProfessorWithUser = (overrides: any = {}) => ({
  ...mockProfessor(),
  user: mockUser(),
  ...overrides,
})

export const mockPostWithProfessorAndUser = (overrides: any = {}) => ({
  ...mockPost(),
  professor: {
    ...mockProfessor(),
    user: mockUser(),
  },
  ...overrides,
})