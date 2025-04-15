import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/accounts - Listar todas as contas
export async function GET() {
  try {
    const accounts = await prisma.account.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(accounts);
  } catch (error) {
    console.error('Erro ao buscar contas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar contas' },
      { status: 500 }
    );
  }
}

// POST /api/accounts - Criar uma nova conta
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const account = await prisma.account.create({
      data: {
        name: data.name,
        balance: parseFloat(data.balance) || 0,
        type: data.type,
      },
    });
    return NextResponse.json(account);
  } catch (error) {
    console.error('Erro ao criar conta:', error);
    return NextResponse.json(
      { error: 'Erro ao criar conta' },
      { status: 500 }
    );
  }
} 