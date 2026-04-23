import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { eventCreateSchema } from "@/lib/validations/event"

// D-04 + Pitfall #2: status 는 publish endpoint 전용, slug 는 immutable (URL/SEO 안정성).
// eventCreateSchema 는 slug 를 포함하지 않으므로 omit({ status: true }) 만으로 둘 다 차단됨.
const eventPatchSchema = eventCreateSchema.partial().omit({ status: true })

const EVENT_SELECT = `
  *,
  payment_provider:payment_providers(id, code, name_ko),
  category:categories(id, slug, name_ko),
  brand:brands(id, slug, name_ko)
` as const

function verifyAdmin(request: NextRequest): boolean {
  const secret = request.headers.get("x-admin-secret")
  return secret === process.env.ADMIN_SECRET_KEY
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized", status: 401 }, { status: 401 })
  }

  const { id } = await params
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("events")
    .select(EVENT_SELECT)
    .eq("id", id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "Event not found", status: 404 }, { status: 404 })
  }

  return NextResponse.json({ data })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized", status: 401 }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const parsed = eventPatchSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((i) => i.message).join(", "), status: 400 },
      { status: 400 },
    )
  }

  const supabase = createAdminClient()

  // updated_at: events 테이블은 trg_events_updated 트리거 보유.
  // belt-and-suspenders 로 명시 세팅 — 트리거가 덮어써도 동일 값.
  const updateData = {
    ...parsed.data,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from("events")
    .update(updateData)
    .eq("id", id)
    .select(EVENT_SELECT)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message, status: 500 }, { status: 500 })
  }

  return NextResponse.json({ data, message: "이벤트가 수정되었습니다" })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized", status: 401 }, { status: 401 })
  }

  const { id } = await params
  const supabase = createAdminClient()

  // FK 안전: event_submissions.approved_event_id 는 ON DELETE 룰이 없음.
  // 명시적 null 처리 후 events 행 삭제.
  const { error: nullErr } = await supabase
    .from("event_submissions")
    .update({ approved_event_id: null })
    .eq("approved_event_id", id)

  if (nullErr) {
    return NextResponse.json({ error: nullErr.message, status: 500 }, { status: 500 })
  }

  const { error: delErr } = await supabase
    .from("events")
    .delete()
    .eq("id", id)

  if (delErr) {
    return NextResponse.json({ error: delErr.message, status: 500 }, { status: 500 })
  }

  return NextResponse.json({ data: { id }, message: "이벤트가 완전 삭제되었습니다" })
}
