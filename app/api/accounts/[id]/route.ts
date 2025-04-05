import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/accounts/[id] - Obter uma conta específica
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const account = await prisma.account.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Conta não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(account);
  } catch (error) {
    console.error('Erro ao buscar conta:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar conta' },
      { status: 500 }
    );
  }
}

// PUT /api/accounts/[id] - Atualizar uma conta
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const data = await request.json();
    const account = await prisma.account.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        name: data.name,
        balance: parseFloat(data.balance) || 0,
        type: data.type,
      },
    });
    return NextResponse.json(account);
  } catch (error) {
    console.error('Erro ao atualizar conta:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar conta' },
      { status: 500 }
    );
  }
}

// DELETE /api/accounts/[id] - Excluir uma conta
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await prisma.account.delete({
      where: {
        id: parseInt(params.id),
      },
    });
    return NextResponse.json({ message: 'Conta excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir conta:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir conta' },
      { status: 500 }
    );
  }
} 