import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    
    // 检查数据库连接
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed }
    });
    
    return NextResponse.json({ id: user.id, name: user.name, email: user.email });
  } catch (error: any) {
    // 关键：将详细错误打印到 Vercel 日志中
    console.error("DEBUG_REGISTER_ERROR:", error);
    return NextResponse.json({ 
      error: 'Registration failed', 
      details: error.message,
      code: error.code 
    }, { status: 500 });
  }
}
