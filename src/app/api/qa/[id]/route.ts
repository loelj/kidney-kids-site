import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const question = await prisma.question.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { id: true, name: true } },
      answers: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'asc' }
      }
    }
  });
  if (!question) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(question);
}
