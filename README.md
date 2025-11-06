# 📰 articles-admin-rest

Uma **API RESTful** robusta e modular para a administração de artigos, usuários e permissões, construída com **NestJS** e **TypeScript**. Utiliza **Prisma** como ORM para gerenciamento do banco de dados e é facilmente conteinerizável com **Docker**.

## Tecnologias Utilizadas

- **Framework:** [NestJS](https://nestjs.com/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **ORM:** [Prisma](https://docs.nestjs.com/recipes/prisma)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
- **Conteinerização:** Docker e [Docker Compose](https://docs.docker.com/compose/)
- **Validação:** Class-validator/Class-transformer (integrados ao NestJS)
- **Linter:** ESLint

---

## Estrutura do Projeto

O projeto segue a arquitetura modular e de convenções do NestJS.

- `src/modules`: Contém os módulos principais da aplicação, como:
  - `articles`: Lógica para criação, listagem, atualização e exclusão de artigos.
  - `users`: Gerenciamento de usuários.
  - `auth`: Módulo de autenticação (JWT) e gerenciamento de permissões/papéis.
  - `permissions`: Lista permissões.
- `src/common`: Utilitários compartilhados, como serviços de banco de dados (`db`), manipulação de erros (`errors`, `filters`) e sanitização (`utils`).
- `prisma`: Esquema do banco de dados (`schema.prisma`), _migrations_ e _seeders_.

---

## Configuração e Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18+)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/products/docker-desktop) e [Docker Compose](https://docs.docker.com/compose/install/) (para desenvolvimento conteinerizado)

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto, copiando o exemplo `.env.example`

Suba a aplicação e o banco de dados em containers

```bash
docker-compose up -d --build
```

Após o docker compose criar e iniciar os serviços `postgres` e `backend`, como descrito no arquivo `docker-compose.yml`, o comando `npx prisma generate && npm run db:init && npm run start:dev` será executado no **backend**. Este comando cria o _@prisma/client_, executa a seed, para criação das permissões de usuário e usuário root (descrição abaixo) e inicia a aplicação.

```
"name": "Root User",
"email": "root@admin.com",
"password": "123@Mudar",
"permissions": [
  {
    "name": "admin",
    "description": "Full access to all actions"
  }
]
```

> Na pasta `xRestclient-reqs` você encontra as requisições prontas para testar o uso.
