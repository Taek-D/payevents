import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email")

  if (!email) {
    return NextResponse.json(
      { success: false, message: "이메일이 필요합니다" },
      { status: 400 }
    )
  }

  const normalized = email.toLowerCase().trim()
  const supabase = await createClient()

  const { error } = await supabase
    .from("newsletter_subscribers")
    .update({
      is_active: false,
      unsubscribed_at: new Date().toISOString(),
    })
    .eq("email", normalized)

  if (error) {
    return NextResponse.json(
      { success: false, message: "처리 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    message: "수신 거부가 완료되었어요",
  })
}
