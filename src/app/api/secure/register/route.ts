import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, cpf, password } = body ?? {};

    if (!name || !email || !cpf || !password) {
      return NextResponse.json({ message: 'Dados de cadastro incompletos' }, { status: 400 });
    }

    const backendRes = await fetch('http://localhost:3333/register/client', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, cpf, password }),
    });

    const data = await backendRes.json().catch(() => ({}));
    return NextResponse.json(data, { status: backendRes.status });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    console.error('[secure/register]', message);
    return NextResponse.json({ message: 'Erro ao criar conta' }, { status: 500 });
  }
}
