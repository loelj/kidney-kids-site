import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { content } = await req.json();
  if (!content) {
    return NextResponse.json({ error: 'Missing content' }, { status: 400 });
  }
  const answer = await prisma.answer.create({
    data: {
      content,
      questionId: params.id,
      userId: (session.user as any).id
    },
    include: { user: { select: { id: true, name: true } } }
  });
  return NextResponse.json(answer);
}
