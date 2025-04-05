import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/transactions - Listar todas as transações
export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        category: true,
        account: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar transações' },
      { status: 500 }
    );
  }
}

// POST /api/transactions - Criar uma nova transação
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const transaction = await prisma.transaction.create({
      data: {
        description: data.description,
        amount: parseFloat(data.amount),
        date: new Date(data.date),
        type: data.type,
        categoryId: data.categoryId,
        accountId: data.accountId,
      },
      include: {
        category: true,
        account: true,
      },
    });
    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    return NextResponse.json(
      { error: 'Erro ao criar transação' },
      { status: 500 }
    );
  }
} 