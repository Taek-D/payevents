import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const isUuid = UUID_REGEX.test(id)
  const column = isUuid ? "id" : "slug"

  // 1단계: 기본 이벤트 조회 (타입 안전)
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq(column, id)
    .eq("status", "published")
    .single()

  if (error || !event) {
    return NextResponse.json(
      { error: "이벤트를 찾을 수 없습니다", status: 404 },
      { status: 404 }
    )
  }

  // view_count 증가
  await supabase
    .from("events")
    .update({ view_count: event.view_count + 1 })
    .eq("id", event.id)

  // 2단계: 관련 데이터 병렬 조회
  const [providerRes, categoryRes, brandRes] = await Promise.all([
    supabase.from("payment_providers").select("id, code, name_ko").eq("id", event.payment_provider_id).single(),
    supabase.from("categories").select("id, slug, name_ko").eq("id", event.category_id).single(),
    supabase.from("brands").select("id, slug, name_ko").eq("id", event.brand_id).single(),
  ])

  return NextResponse.json({
    data: {
      ...event,
      view_count: event.view_count + 1,
      payment_provider: providerRes.data,
      category: categoryRes.data,
      brand: brandRes.data,
    },
  })
}
