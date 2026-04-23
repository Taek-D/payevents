import type { CheerioAPI } from "cheerio"
import type { ParserResult, ScrapeWarning } from "./index"
import { scrapeGeneric } from "./generic"
import { extractJsonLdOffers } from "./shared/jsonld"
import { parseKoreanPeriod, isoDateOrNull } from "./shared/date"
import { parseBenefit } from "./shared/benefit"
import { inferCategory } from "./shared/category"

/**
 * 카카오페이 이벤트 페이지 (kakaopay.com, biz.kakaopay.com) 파서.
 * SPA/static 혼재. generic fallback + 결제사 보강.
 */
export function scrapeKakaopay($: CheerioAPI, url: string): ParserResult {
  const base = scrapeGeneric($, url)
  const warnings = new Set<ScrapeWarning>(base.warnings)
  const event = { ...base.event }

  const offers = extractJsonLdOffers($).offers
  event.startDate = isoDateOrNull(offers[0]?.validFrom) ?? event.startDate
  const offerEnd = isoDateOrNull(
    offers[0]?.validThrough ?? offers[0]?.priceValidUntil,
  )
  if (offerEnd) {
    event.endDate = offerEnd
    warnings.delete("period_not_found")
  }
  if (!event.endDate) {
    const period = parseKoreanPeriod($("body").text())
    if (period.endDate) {
      event.startDate = period.startDate ?? event.startDate
      event.endDate = period.endDate
      warnings.delete("period_not_found")
    }
  }

  const benefit = parseBenefit(`${event.title ?? ""} ${event.summary ?? ""}`)
  event.benefitText = benefit.benefitText ?? event.benefitText
  event.discountAmount = benefit.discountAmount ?? event.discountAmount

  event.brandCandidate = extractBrandCandidate(event.title)

  const catSlug = inferCategory(event.title, event.brandCandidate)
  if (catSlug) {
    event.categorySuggestion = catSlug
    warnings.delete("category_unknown")
  }

  return { event, warnings: Array.from(warnings) }
}

function extractBrandCandidate(title: string | null): string | null {
  if (!title) return null
  const stripped = title
    .replace(/^카카오(?:페이)?\s*/i, "")
    .replace(/^kakao(?:pay)?\s*/i, "")
    .trim()
  const m = stripped.match(/^([가-힣A-Za-z0-9&'.-]+)/)
  return m ? m[1] : null
}
