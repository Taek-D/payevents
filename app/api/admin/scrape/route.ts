import { NextRequest, NextResponse } from "next/server"
import { z } from "zod/v4"
import { createClient } from "@/lib/supabase/server"
import { fetchHtml } from "@/lib/utils/fetch-html"
import {
  dispatchScraper,
  scrapeResponseSchema,
  type ScrapeResponse,
} from "@/lib/scrapers"
import { findBrandByNormalizedName } from "@/lib/admin/brand-resolver"

// Cheerio는 Node.js API(Buffer 등)를 사용하므로 Node runtime 필수 (RESEARCH §Pitfall 1).
// Next.js 16 Route Handler 기본값이 nodejs이지만 명시적 선언으로 안전장치.
export const runtime = "nodejs"

function verifyAdmin(request: NextRequest): boolean {
  const secret = request.headers.get("x-admin-secret")
  return secret === process.env.ADMIN_SECRET_KEY
}

const scrapeRequestSchema = z.object({
  url: z.string().url("유효한 URL이 필요합니다"),
})

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: "요청 본문이 유효한 JSON이 아닙니다" },
      { status: 400 },
    )
  }

  const parsed = scrapeRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((i) => i.message).join(", ") },
      { status: 400 },
    )
  }

  try {
    // 소스당 8초 (ROADMAP 성공 기준 #3, D-14). crawl 라우트는 기본 10s 유지.
    const html = await fetchHtml(parsed.data.url, { timeoutMs: 8000 })
    const response: ScrapeResponse = dispatchScraper(parsed.data.url, html)

    // 브랜드 lookup-only (D-10) — 매칭 시 brandId 채움, 실패 시 brand_ambiguous 경고.
    // 자동 INSERT 절대 금지. 실제 이벤트 저장 시에만 resolveBrand로 생성.
    if (response.data.brandCandidate) {
      const supabase = await createClient()
      const brand = await findBrandByNormalizedName(
        response.data.brandCandidate,
        supabase,
      )
      if (brand) {
        response.data.brandId = brand.id
      } else if (!response.warnings.includes("brand_ambiguous")) {
        response.warnings.push("brand_ambiguous")
      }
    } else if (!response.warnings.includes("brand_ambiguous")) {
      response.warnings.push("brand_ambiguous")
    }

    // 내부 계약 검증 — 실패 시 500 (이 시점에 실패하면 파서 버그). runtime 안전장치.
    const validated = scrapeResponseSchema.safeParse(response)
    if (!validated.success) {
      return NextResponse.json(
        { error: "스크래퍼 응답이 스키마를 만족하지 않습니다" },
        { status: 500 },
      )
    }

    return NextResponse.json(validated.data)
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "URL을 가져오는 중 오류가 발생했습니다"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
