import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const questions = await prisma.question.findMany({
    include: {
      user: { select: { id: true, name: true } },
      _count: { select: { answers: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(questions);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { title, content } = await req.json();
  if (!title || !content) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const question = await prisma.question.create({
    data: {
      title,
      content,
      userId: (session.user as any).id
    },
    include: { user: { select: { id: true, name: true } } }
  });
  return NextResponse.json(question);
}
