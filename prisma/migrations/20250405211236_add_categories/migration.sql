/*
  Warnings:

  - You are about to drop the column `category` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Category_name_key";

-- Primeiro, vamos criar uma categoria padrão para cada tipo
INSERT INTO "Category" ("name", "type", "createdAt", "updatedAt")
VALUES 
  ('Outros (Receita)', 'income', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Outros (Despesa)', 'expense', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Agora vamos adicionar a coluna categoryId e fazer a associação com as categorias padrão
ALTER TABLE "Transaction" ADD COLUMN "categoryId" INTEGER;

-- Atualizar as transações existentes para usar as categorias padrão
UPDATE "Transaction" 
SET "categoryId" = (
  SELECT id FROM "Category" 
  WHERE type = "Transaction".type 
  LIMIT 1
);

-- Tornar a coluna categoryId obrigatória
ALTER TABLE "Transaction" ALTER COLUMN "categoryId" SET NOT NULL;

-- Adicionar a chave estrangeira
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" 
FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
