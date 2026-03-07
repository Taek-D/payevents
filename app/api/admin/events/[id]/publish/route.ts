import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { eventPublishSchema } from "@/lib/validations/event"
import type { EventUpdate } from "@/lib/supabase/types"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const secret = request.headers.get("x-admin-secret")
  if (secret !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized", status: 401 }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const parsed = eventPublishSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((i) => i.message).join(", "), status: 400 },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  const updateData: EventUpdate = { status: parsed.data.status }
  if (parsed.data.status === "published") {
    updateData.published_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from("events")
    .update(updateData)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message, status: 500 }, { status: 500 })
  }

  return NextResponse.json({
    data,
    message: `이벤트 상태가 '${parsed.data.status}'로 변경되었습니다`,
  })
}
