import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

type SortOption = "latest" | "ending_soon" | "popular"

const EVENT_SELECT = `
  *,
  payment_provider:payment_providers(id, code, name_ko),
  category:categories(id, slug, name_ko),
  brand:brands(id, slug, name_ko)
` as const

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const provider = searchParams.get("provider")
  const category = searchParams.get("category")
  const brand = searchParams.get("brand")
  const q = searchParams.get("q")
  const sort = (searchParams.get("sort") as SortOption) || "latest"
  const endingSoon = searchParams.get("ending_soon")
  const page = Math.max(1, Number(searchParams.get("page")) || 1)
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 20))

  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]
  const offset = (page - 1) * limit

  // ADMIN-03: GET 핸들러는 read-only. 만료된 이벤트는 .gte 필터로 응답에서 제외하고,
  // status 동기화는 /api/cron/archive-expired (vercel.json daily cron)에 위임한다.
  let query = supabase
    .from("events")
    .select(EVENT_SELECT, { count: "exact" })
    .eq("status", "published" as const)
    .gte("end_date", today)

  // ending_soon=true 필터: D-3 이내 이벤트만
  if (endingSoon === "true") {
    const threeDaysLater = new Date()
    threeDaysLater.setDate(threeDaysLater.getDate() + 3)
    const thresholdDate = threeDaysLater.toISOString().split("T")[0]
    query = query.gte("end_date", today).lte("end_date", thresholdDate)
  }

  if (provider) {
    const { data: prov } = await supabase
      .from("payment_providers")
      .select("id")
      .eq("code", provider)
      .single()
    if (prov) query = query.eq("payment_provider_id", prov.id)
  }

  if (category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", category)
      .single()
    if (cat) query = query.eq("category_id", cat.id)
  }

  if (brand) {
    const { data: br } = await supabase
      .from("brands")
      .select("id")
      .eq("slug", brand)
      .single()
    if (br) query = query.eq("brand_id", br.id)
  }

  if (q) {
    query = query.or(`title.ilike.%${q}%,summary.ilike.%${q}%`)
  }

  if (sort === "ending_soon") {
    query = query.gte("end_date", today).order("end_date", { ascending: true })
  } else if (sort === "popular") {
    query = query.order("view_count", { ascending: false })
  } else {
    query = query.order("published_at", { ascending: false })
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json({ error: error.message, status: 500 }, { status: 500 })
  }

  const total = count ?? 0

  return NextResponse.json({
    data: data ?? [],
    total,
    page,
    hasMore: offset + limit < total,
  })
}
