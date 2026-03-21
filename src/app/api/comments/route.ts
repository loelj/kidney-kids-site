import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const articleId = req.nextUrl.searchParams.get('articleId');
  if (!articleId) return NextResponse.json([]);
  const comments = await prisma.comment.findMany({
    where: { articleId },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(comments);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { content, articleId } = await req.json();
  if (!content || !articleId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const comment = await prisma.comment.create({
    data: {
      content,
      articleId,
      userId: (session.user as any).id
    },
    include: { user: { select: { id: true, name: true } } }
  });
  return NextResponse.json(comment);
}
