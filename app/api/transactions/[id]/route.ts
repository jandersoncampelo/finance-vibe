import { NextResponse } from 'next/server';
import prisma from '../../../../src/lib/prisma';

// GET /api/transactions/[id] - Obter uma transação específica
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transação não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar transação' },
      { status: 500 }
    );
  }
}

// PUT /api/transactions/[id] - Atualizar uma transação
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const transaction = await prisma.transaction.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        description: data.description,
        amount: parseFloat(data.amount),
        date: new Date(data.date),
        type: data.type,
        categoryId: data.categoryId,
      },
      include: {
        category: true,
      },
    });
    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar transação' },
      { status: 500 }
    );
  }
}

// DELETE /api/transactions/[id] - Excluir uma transação
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.transaction.delete({
      where: {
        id: parseInt(params.id),
      },
    });
    return NextResponse.json({ message: 'Transação excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir transação:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir transação' },
      { status: 500 }
    );
  }
} 