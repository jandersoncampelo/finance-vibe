# Finance Vibe - Controle Financeiro

Uma aplicação moderna de controle financeiro pessoal construída com Next.js, Ant Design, Prisma e PostgreSQL.

## Tecnologias Utilizadas

- Next.js 14
- TypeScript
- Ant Design
- Prisma ORM
- PostgreSQL
- Tailwind CSS

## Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL instalado e rodando
- npm ou yarn

## Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o banco de dados:
   - Crie um banco de dados PostgreSQL chamado `finance_vibe`
   - Configure as variáveis de ambiente no arquivo `.env`

4. Execute as migrações do Prisma:
   ```bash
   npx prisma migrate dev
   ```

5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Estrutura do Projeto

- `/app` - Páginas e componentes da aplicação
- `/prisma` - Schema e migrações do banco de dados
- `/public` - Arquivos estáticos
- `/components` - Componentes reutilizáveis

## Funcionalidades

- Dashboard com visão geral das finanças
- Registro de receitas e despesas
- Categorização de transações
- Relatórios e gráficos
- Interface responsiva e moderna

## Licença

MIT

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
