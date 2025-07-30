# Blog Educacional - Documentação Técnica

## 🤝 GRUPO

* RM 362457  - Alessandra  Guedes
* RM 362166 - Ana Carolina
* RM 363723 - Vinicius Faria
* RM 360942 - Vitor Freire

## 📋 Visão Geral

O projeto Blog Educacional é uma API REST desenvolvida para gerenciar conteúdo educacional, permitindo que professores publiquem e compartilhem material didático através de posts. O sistema está estruturado seguindo princípios de Clean Architecture e SOLID, garantindo escalabilidade e manutenibilidade.

## 🚀 Tecnologias Utilizadas

### Core Framework
- **Node.js** - Runtime JavaScript server-side
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Fastify** - Framework web de alta performance para Node.js

### Base de Dados
- **PostgreSQL** - Sistema de gerenciamento de banco de dados relacional
- **pg** - Driver oficial PostgreSQL para Node.js

### Desenvolvimento e Testes
- **Vitest** - Framework de testes moderno e rápido
- **TSX** - Executor TypeScript para desenvolvimento
- **TSUP** - Bundler TypeScript para produção

### Validação e Configuração
- **Zod** - Biblioteca de validação e parsing de esquemas TypeScript
- **Dotenv** - Gerenciamento de variáveis de ambiente

## 🏗️ Arquitetura do Projeto

O projeto segue os princípios da **Clean Architecture**, organizando o código em camadas bem definidas:

```
src/
├── entities/          # Entidades de domínio
├── use-cases/         # Casos de uso (regras de negócio)
├── repositories/      # Camada de acesso a dados
├── http/             # Camada de apresentação (controllers/routes)
├── lib/              # Utilitários e configurações
└── env/              # Configuração de ambiente
```

### Camadas da Arquitetura

#### 1. **Entities** (Domínio)
- **Localização**: `src/entities/models/`
- **Responsabilidade**: Definir as estruturas de dados principais
- **Arquivos**:
  - `user.interface.ts` - Interface do usuário
  - `professor.interface.ts` - Interface do professor
  - `post.interface.ts` - Interface do post

#### 2. **Use Cases** (Aplicação)
- **Localização**: `src/use-cases/`
- **Responsabilidade**: Implementar regras de negócio específicas
- **Implementados**:
  - `find-all-posts.ts` - Buscar todos os posts
  - `search-post.ts` - Buscar posts por query string
- **Em desenvolvimento**:
  - `create-post.ts`, `update-post.ts`, `delete-post.ts`, `find-post-by-id.ts`

#### 3. **Repositories** (Infraestrutura)
- **Localização**: `src/repositories/`
- **Responsabilidade**: Abstrair acesso aos dados
- **Padrão**: Interface + Implementação
- **Implementado**: `PostRepository` com métodos de busca e pesquisa

#### 4. **HTTP Controllers** (Apresentação)
- **Localização**: `src/http/controller/post/`
- **Responsabilidade**: Gerenciar requisições HTTP
- **Implementados**:
  - `find-all.ts` - GET /posts
  - `search.ts` - GET /posts/search

#### 5. **Factory Pattern**
- **Localização**: `src/use-cases/factory/`
- **Responsabilidade**: Instanciar e configurar use cases
- **Benefício**: Inversão de dependência e facilita testes

## 🗄️ Modelo de Dados

### Estrutura do Banco de Dados

```sql
-- Usuários do sistema
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

-- Professores vinculados aos usuários
CREATE TABLE professor (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    materia VARCHAR(100),
    user_id INTEGER UNIQUE NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
);

-- Posts educacionais
CREATE TABLE post (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo VARCHAR(200) NOT NULL,
    resumo VARCHAR(500),
    conteudo TEXT NOT NULL,
    professor_id INTEGER NOT NULL REFERENCES professor(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Relacionamentos
- **User 1:1 Professor** - Cada usuário pode ser um professor
- **Professor 1:N Post** - Um professor pode ter vários posts
- **Cascade Delete** - Exclusão em cascata para manter integridade

## 📡 API Endpoints

### Implementados

#### GET /posts
**Descrição**: Retorna todos os posts cadastrados
**Resposta**: 
```json
{
  "posts": [
    {
      "id": "uuid",
      "titulo": "string",
      "resumo": "string",
      "conteudo": "string",
      "professor_id": number,
      "created_at": "datetime",
      "updated_at": "datetime"
    }
  ]
}
```

#### GET /posts/search?query=termo
**Descrição**: Busca posts por título ou conteúdo
**Parâmetros**: 
- `query` (required): Termo de busca
**Resposta**: Array de posts que correspondem à busca
**Status Codes**:
- 200: Posts encontrados
- 404: Nenhum post encontrado
- 400: Parâmetro query inválido

### Em Desenvolvimento
- `POST /posts` - Criar novo post
- `GET /posts/:id` - Buscar post por ID
- `PUT /posts/:id` - Atualizar post
- `DELETE /posts/:id` - Deletar post

## 🧪 Estratégia de Testes

### Estrutura de Testes
```
__tests__/
├── setup/              # Configurações e mocks
│   ├── mocks/         # Mocks das entidades e repositórios
│   └── test-utils.ts  # Utilitários para testes
├── unit/              # Testes unitários
│   ├── entities/      # Testes das entidades
│   ├── repositories/  # Testes dos repositórios
│   └── use-cases/     # Testes dos casos de uso
└── integration/       # Testes de integração
    └── search-api.test.ts  # Teste da API de busca
```

### Ferramentas de Mock
- **Entity Mocks**: Dados de teste para User, Professor e Post
- **Repository Mocks**: Simulação de operações de banco
- **Scenarios**: Diferentes cenários (sucesso, erro, não encontrado)

### Cobertura de Testes
- **Configuração**: Cobertura mínima de 20% (configurável)
- **Reports**: Text, HTML e LCOV
- **Exclusões**: node_modules, dist, arquivos de configuração

## ⚙️ Configuração e Ambiente

### Variáveis de Ambiente
```env
PORT=3000
ENV=development
POSTGRES_DB=blog_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_PORT=5432
```

### Scripts Disponíveis
```json
{
  "start:dev": "tsx watch src/server.ts",      // Desenvolvimento com hot reload
  "start": "node build/server.js",             // Produção
  "build": "tsup src --out-dir build",         // Build para produção
  "test": "vitest",                            // Testes em modo watch
  "test:run": "vitest run",                    // Executar testes uma vez
  "test:coverage": "vitest run --coverage"     // Testes com cobertura
}
```

## 🔧 Padrões de Design Implementados

### 1. **Repository Pattern**
- **Objetivo**: Abstrair acesso aos dados
- **Benefício**: Facilita testes e mudanças de banco
- **Implementação**: Interface + Classe concreta

### 2. **Factory Pattern**
- **Objetivo**: Centralizar criação de objetos complexos
- **Benefício**: Reduz acoplamento entre camadas
- **Uso**: Criação de use cases com dependências

### 3. **Dependency Injection**
- **Objetivo**: Inversão de controle
- **Benefício**: Maior testabilidade e flexibilidade
- **Implementação**: Injeção via construtor

### 4. **Error Handling**
- **Custom Errors**: `ResourceNotFoundError`
- **Validation**: Zod para validação de entrada
- **HTTP Status**: Códigos apropriados para cada situação

## 📊 Dados de Exemplo

O sistema vem pré-populado com:
- **8 Usuários**: Representando diferentes matérias
- **8 Professores**: Com nomes criativos (músicos famosos)
- **16 Posts**: Conteúdo educacional variado

### Matérias Disponíveis
- Química, Inglês, Português, Geografia
- História, Física, Matemática, Biologia

## 🚦 Status do Desenvolvimento

### ✅ Concluído
- Estrutura base da arquitetura
- Modelos de dados e migrações
- Busca de posts (findAll e search)
- Configuração de testes
- Documentação de API

### 🔄 Em Desenvolvimento
- CRUD completo de posts (Create, Update, Delete, FindById)
- Implementação dos use cases restantes
- Testes unitários completos
- Autenticação e autorização

### 📋 Próximos Passos
- Sistema de autenticação JWT
- Middleware de autorização
- Validações mais robustas
- Rate limiting
- Logs estruturados
- Docker containerization

## 🏆 Decisões Arquiteturais

### Por que Fastify?
- **Performance**: Mais rápido que Express
- **TypeScript**: Excelente suporte nativo
- **Plugins**: Ecossistema maduro
- **Validação**: Integração nativa com schemas

### Por que Clean Architecture?
- **Testabilidade**: Facilita criação de testes
- **Manutenibilidade**: Código organizado e desacoplado
- **Escalabilidade**: Suporta crescimento do projeto
- **Flexibilidade**: Facilita mudanças futuras

### Por que PostgreSQL?
- **ACID**: Transações confiáveis
- **Relacionamentos**: Suporte robusto a FKs
- **Performance**: Otimizado para consultas complexas
- **Extensões**: UUID, full-text search

### Por que Vitest?
- **Velocidade**: Mais rápido que Jest
- **ESM**: Suporte nativo a módulos ES
- **TypeScript**: Zero configuração
- **Compatibilidade**: API similar ao Jest

## 🔍 Exemplos de Uso

### Buscar todos os posts
```bash
curl -X GET http://localhost:3000/posts
```

### Buscar posts por termo
```bash
curl -X GET "http://localhost:3000/posts/search?query=química"
```
### Instalar dependências
```bash
npm install
```

### Executar testes
```bash
npm run test:coverage
npm run test:run
```

### Iniciar desenvolvimento
```bash
npm run start:dev
```

## 📝 Considerações Finais

Este projeto demonstra uma implementação sólida de uma API REST seguindo boas práticas de desenvolvimento. A arquitetura escolhida permite fácil extensão e manutenção, enquanto os padrões implementados garantem código limpo e testável.

A estrutura atual fornece uma base robusta para expansão futura, incluindo funcionalidades como autenticação, autorização, cache, e outras features avançadas de uma aplicação web moderna.
