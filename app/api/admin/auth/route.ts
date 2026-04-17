import { NextRequest, NextResponse } from 'next/server'
import { validateAdminLogin, createAdminSession, clearAdminSession } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  if (await validateAdminLogin(email, password)) {
    await createAdminSession()
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
}

export async function DELETE() {
  await clearAdminSession()
  return NextResponse.json({ ok: true })
}
