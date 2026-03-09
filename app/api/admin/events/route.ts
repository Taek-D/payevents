import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { eventCreateSchema, eventUpdateSchema } from "@/lib/validations/event"
import { generateEventSlug, ensureUniqueSlug } from "@/lib/utils/slug"

function verifyAdmin(request: NextRequest): boolean {
  const secret = request.headers.get("x-admin-secret")
  return secret === process.env.ADMIN_SECRET_KEY
}

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized", status: 401 }, { status: 401 })
  }

  const supabase = createAdminClient()
  const { searchParams } = request.nextUrl
  const status = searchParams.get("status")

  let query = supabase
    .from("events")
    .select(`
      *,
      payment_provider:payment_providers(id, code, name_ko),
      category:categories(id, slug, name_ko),
      brand:brands(id, slug, name_ko)
    `)
    .order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status as "draft" | "published" | "archived")
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message, status: 500 }, { status: 500 })
  }

  return NextResponse.json({ data: data ?? [] })
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized", status: 401 }, { status: 401 })
  }

  const body = await request.json()
  const parsed = eventCreateSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((i) => i.message).join(", "), status: 400 },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  const { data: brand } = await supabase
    .from("brands")
    .select("slug")
    .eq("id", parsed.data.brand_id)
    .single()

  const { data: provider } = await supabase
    .from("payment_providers")
    .select("code")
    .eq("id", parsed.data.payment_provider_id)
    .single()

  const baseSlug = generateEventSlug(
    provider?.code ?? "unknown",
    brand?.slug ?? "unknown",
    new Date(parsed.data.start_date)
  )
  const slug = await ensureUniqueSlug(baseSlug, supabase)

  const insertData = {
    ...parsed.data,
    slug,
    summary: parsed.data.summary ?? null,
    condition_text: parsed.data.condition_text ?? null,
    max_benefit_value: parsed.data.max_benefit_value ?? null,
    region_limit: parsed.data.region_limit ?? null,
    image_url: parsed.data.image_url ?? null,
    source_url: parsed.data.source_url ?? null,
    published_at: parsed.data.status === "published" ? new Date().toISOString() : null,
  }

  const { data, error } = await supabase
    .from("events")
    .insert(insertData)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message, status: 500 }, { status: 500 })
  }

  return NextResponse.json({ data, message: "이벤트가 생성되었습니다" }, { status: 201 })
}

export async function PUT(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized", status: 401 }, { status: 401 })
  }

  const body = await request.json()
  const parsed = eventUpdateSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((i) => i.message).join(", "), status: 400 },
      { status: 400 }
    )
  }

  const { id, ...updateData } = parsed.data
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("events")
    .update(updateData)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message, status: 500 }, { status: 500 })
  }

  return NextResponse.json({ data, message: "이벤트가 수정되었습니다" })
}
