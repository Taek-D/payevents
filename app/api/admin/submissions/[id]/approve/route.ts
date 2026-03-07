import { NextRequest, NextResponse } from "next/server"
import { z } from "zod/v4"
import { createAdminClient } from "@/lib/supabase/admin"
import { verifyAdmin } from "@/lib/admin/auth"
import { resolveBrand } from "@/lib/admin/brand-resolver"
import { generateEventSlug, ensureUniqueSlug } from "@/lib/utils/slug"

const approveBodySchema = z.object({
  title: z.string().min(1),
  summary: z.string().optional(),
  benefitText: z.string().min(1),
  conditionText: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  categorySlug: z.string().min(1),
  brandName: z.string().min(1),
  sourceUrl: z.string().url().optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const parsed = approveBodySchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((i) => i.message).join(", ") },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  // 1. Fetch submission to get payment_provider_code
  const { data: submission, error: submissionError } = await supabase
    .from("event_submissions")
    .select("*")
    .eq("id", id)
    .single()

  if (submissionError || !submission) {
    return NextResponse.json({ error: "제보를 찾을 수 없습니다" }, { status: 404 })
  }

  // 2. Resolve brand (get or create)
  let brand: { id: string; slug: string; name_ko: string } | null
  try {
    brand = await resolveBrand(parsed.data.brandName, supabase)
  } catch (err) {
    const message = err instanceof Error ? err.message : "브랜드 처리 실패"
    return NextResponse.json({ error: message }, { status: 500 })
  }

  if (!brand) {
    return NextResponse.json({ error: "브랜드 이름이 필요합니다" }, { status: 400 })
  }

  // 3. Look up category by slug
  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", parsed.data.categorySlug)
    .single()

  if (categoryError || !category) {
    return NextResponse.json({ error: "카테고리를 찾을 수 없습니다" }, { status: 400 })
  }

  // 4. Look up provider by code
  const { data: provider, error: providerError } = await supabase
    .from("payment_providers")
    .select("id")
    .eq("code", submission.payment_provider_code)
    .single()

  if (providerError || !provider) {
    return NextResponse.json({ error: "결제사를 찾을 수 없습니다" }, { status: 400 })
  }

  // 5. Generate unique slug
  const baseSlug = generateEventSlug(
    submission.payment_provider_code,
    brand.slug,
    parsed.data.startDate ? new Date(parsed.data.startDate) : new Date()
  )
  const slug = await ensureUniqueSlug(baseSlug, supabase)

  // 6. Insert event
  const { data: event, error: eventError } = await supabase
    .from("events")
    .insert({
      slug,
      title: parsed.data.title,
      summary: parsed.data.summary ?? null,
      payment_provider_id: provider.id,
      category_id: category.id,
      brand_id: brand.id,
      benefit_text: parsed.data.benefitText,
      condition_text: parsed.data.conditionText ?? null,
      start_date: parsed.data.startDate,
      end_date: parsed.data.endDate,
      source_url: parsed.data.sourceUrl ?? submission.source_url ?? null,
      source_type: "submission",
      is_verified: true,
      status: "published",
      published_at: new Date().toISOString(),
    })
    .select("id, slug")
    .single()

  if (eventError || !event) {
    return NextResponse.json({ error: eventError?.message ?? "이벤트 생성 실패" }, { status: 500 })
  }

  // 7. Update submission status
  const { error: updateError } = await supabase
    .from("event_submissions")
    .update({
      status: "approved",
      approved_event_id: event.id,
    })
    .eq("id", id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, eventId: event.id, eventSlug: event.slug })
}
