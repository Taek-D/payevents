import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { subscribeSchema } from "@/lib/validations/newsletter"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const parsed = subscribeSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.issues[0].message },
      { status: 400 }
    )
  }

  const email = parsed.data.email.toLowerCase().trim()
  const source = parsed.data.source

  const supabase = await createClient()

  // 기존 구독자 확인
  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("id, is_active")
    .eq("email", email)
    .single()

  if (existing) {
    if (existing.is_active) {
      return NextResponse.json({
        success: true,
        message: "이미 구독 중이에요 👍",
        already: true,
      })
    }

    // 비활성화 상태 → 재구독
    await supabase
      .from("newsletter_subscribers")
      .update({ is_active: true, unsubscribed_at: null })
      .eq("id", existing.id)

    return NextResponse.json({
      success: true,
      message: "구독이 완료되었어요 🎉",
    })
  }

  // 신규 구독
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email, source })

  if (error) {
    return NextResponse.json(
      { success: false, message: "잠시 후 다시 시도해주세요" },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    message: "구독이 완료되었어요 🎉",
  })
}
