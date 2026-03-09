import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    return NextResponse.json(
      { error: "관리자 계정이 설정되지 않았습니다" },
      { status: 500 }
    )
  }

  if (email !== adminEmail || password !== adminPassword) {
    return NextResponse.json(
      { error: "이메일 또는 비밀번호가 올바르지 않습니다" },
      { status: 401 }
    )
  }

  const cookieStore = await cookies()
  cookieStore.set("admin_session", process.env.ADMIN_SECRET_KEY ?? "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24시간
  })

  return NextResponse.json({ message: "로그인 성공" })
}
