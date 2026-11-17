# Pricely

SaaS de **precificação e orçamentos** para pequenas empresas: o usuário cadastra custos e produtos, calcula o preço de venda e gera orçamentos.

🌐 Em produção: **[nexprice.com.br](https://nexprice.com.br)**

## Funcionalidades

- Cadastro, login e recuperação de senha (Clerk)
- Dashboard com gráficos
- Gestão de equipe e parceiros
- Planos e pagamento (AbacatePay)
- Rotas de API REST em `app/api`

## Stack

| Camada | Tecnologia |
|---|---|
| Front-end | Next.js (App Router), React, TypeScript, Tailwind CSS, Radix UI |
| Back-end | Route Handlers (API REST), Prisma ORM |
| Banco | MySQL (8 modelos no `prisma/schema.prisma`) |
| Autenticação | Clerk |
| Infra | Docker, Railway |

## Estrutura

```
app/          páginas e rotas de API (app/api)
components/   componentes de interface reutilizáveis
hooks/        hooks React
lib/ utils/   regras de negócio e utilitários
prisma/       schema do banco
```

## Rodando localmente

Crie um `.env` com `DATABASE_URL` (MySQL) e as chaves do Clerk e rode:

```bash
npm install
npx prisma generate
npm run dev
```

Acesse http://localhost:3000.
