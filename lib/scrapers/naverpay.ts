import type { CheerioAPI } from "cheerio"
import type { ParserResult, ScrapeWarning } from "./index"
import { scrapeGeneric } from "./generic"
import { extractJsonLdOffers } from "./shared/jsonld"
import { parseKoreanPeriod, isoDateOrNull } from "./shared/date"
import { parseBenefit } from "./shared/benefit"
import { inferCategory } from "./shared/category"

/**
 * 네이버페이 이벤트 페이지 (new-m.pay.naver.com/event, pay.naver.com/...) 파서.
 * Static HTML 비중이 크며 JSON-LD 존재 가능성 중간. generic fallback 결과를 기본값으로 사용하고
 * 기간·혜택·카테고리를 보강한다.
 */
export function scrapeNaverpay($: CheerioAPI, url: string): ParserResult {
  const base = scrapeGeneric($, url)
  const warnings = new Set<ScrapeWarning>(base.warnings)
  const event = { ...base.event }

  // 기간: JSON-LD Offer.validThrough → 본문 텍스트 fallback
  const offers = extractJsonLdOffers($).offers
  const offerEnd = isoDateOrNull(
    offers[0]?.validThrough ?? offers[0]?.priceValidUntil,
  )
  const offerStart = isoDateOrNull(offers[0]?.validFrom)
  if (offerEnd || offerStart) {
    event.startDate = offerStart ?? event.startDate
    event.endDate = offerEnd ?? event.endDate
    if (offerEnd) warnings.delete("period_not_found")
  }
  if (!event.endDate) {
    const bodyText = $("body").text()
    const period = parseKoreanPeriod(bodyText)
    if (period.endDate) {
      event.startDate = period.startDate ?? event.startDate
      event.endDate = period.endDate
      warnings.delete("period_not_found")
    }
  }

  // 혜택 텍스트
  const benefit = parseBenefit(`${event.title ?? ""} ${event.summary ?? ""}`)
  event.benefitText = benefit.benefitText ?? event.benefitText
  event.discountAmount = benefit.discountAmount ?? event.discountAmount

  // 브랜드 후보: 제목에서 첫 단어 추출 (관리자 재확인 전제, D-10 lookup-only)
  event.brandCandidate = extractBrandCandidate(event.title)

  // 카테고리 추론
  const catSlug = inferCategory(event.title, event.brandCandidate)
  if (catSlug) {
    event.categorySuggestion = catSlug
    warnings.delete("category_unknown")
  }

  return { event, warnings: Array.from(warnings) }
}

/** 제목 "네이버페이 스타벅스 10% 할인" → "스타벅스" */
function extractBrandCandidate(title: string | null): string | null {
  if (!title) return null
  const stripped = title
    .replace(/^네이버페이\s*/i, "")
    .replace(/^naverpay\s*/i, "")
    .trim()
  const m = stripped.match(/^([가-힣A-Za-z0-9&'.-]+)/)
  return m ? m[1] : null
}
