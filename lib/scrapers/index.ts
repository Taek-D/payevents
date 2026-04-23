import { load, type CheerioAPI } from "cheerio"
import { z } from "zod/v4"
import { scrapeGeneric } from "./generic"
import { scrapeNaverpay } from "./naverpay"
import { scrapeToss } from "./toss"
import { scrapeKakaopay } from "./kakaopay"
import { scrapePayco } from "./payco"
import { isSpaEmpty } from "./shared/spa"

export type ProviderCode = "NAVERPAY" | "TOSSPAY" | "KAKAOPAY" | "PAYCO" | "UNKNOWN"

export type ScrapeWarning =
  | "period_not_found"
  | "brand_ambiguous"
  | "image_not_found"
  | "category_unknown"
  | "jsonld_parse_failed"
  | "title_missing"
  | "spa_detected"

export type ScrapedEvent = {
  title: string | null
  brandCandidate: string | null
  brandId: string | null
  startDate: string | null
  endDate: string | null
  imageUrl: string | null
  summary: string | null
  benefitText: string | null
  discountAmount: number | null
  categorySuggestion: string | null
  sourceUrl: string
}

export type ScrapeResponse = {
  data: ScrapedEvent
  warnings: ScrapeWarning[]
  _scraped: boolean
  _provider: ProviderCode
}

export type ParserResult = {
  event: Omit<ScrapedEvent, "brandId" | "sourceUrl">
  warnings: ScrapeWarning[]
}

export type ScraperFn = ($: CheerioAPI, url: string) => ParserResult

// Zod schemas (D-16)
export const scrapeWarningSchema = z.enum([
  "period_not_found",
  "brand_ambiguous",
  "image_not_found",
  "category_unknown",
  "jsonld_parse_failed",
  "title_missing",
  "spa_detected",
])

export const scrapedEventSchema = z.object({
  title: z.string().nullable(),
  brandCandidate: z.string().nullable(),
  brandId: z.string().uuid().nullable(),
  startDate: z.string().date().nullable(),
  endDate: z.string().date().nullable(),
  imageUrl: z.string().url().nullable(),
  summary: z.string().nullable(),
  benefitText: z.string().nullable(),
  discountAmount: z.number().int().positive().nullable(),
  categorySuggestion: z.string().nullable(),
  sourceUrl: z.string().url(),
})

export const scrapeResponseSchema = z.object({
  data: scrapedEventSchema,
  warnings: z.array(scrapeWarningSchema),
  _scraped: z.boolean(),
  _provider: z.enum(["NAVERPAY", "TOSSPAY", "KAKAOPAY", "PAYCO", "UNKNOWN"]),
})

type RegistryEntry = {
  match: (host: string) => boolean
  provider: ProviderCode
  parser: ScraperFn
}

// Plan 02-02: 결제사별 파서 4종 등록. endsWith 매칭으로 서브도메인 전부 커버.
export const HOSTNAME_REGISTRY: RegistryEntry[] = [
  {
    match: (h) => h.endsWith("pay.naver.com") || h.endsWith("naverpay.com"),
    provider: "NAVERPAY",
    parser: scrapeNaverpay,
  },
  {
    // Pitfall 8: toss.im, event.toss.im, www.toss.im, tosspayments.com 모두 매칭
    match: (h) => h.endsWith("toss.im") || h.endsWith("tosspayments.com"),
    provider: "TOSSPAY",
    parser: scrapeToss,
  },
  {
    match: (h) => h.endsWith("kakaopay.com"),
    provider: "KAKAOPAY",
    parser: scrapeKakaopay,
  },
  {
    match: (h) => h.endsWith("payco.com"),
    provider: "PAYCO",
    parser: scrapePayco,
  },
]

/**
 * 메인 디스패처. scrape route는 이 함수 하나만 호출한다.
 * - SPA 감지 시 _scraped:false, warnings:["spa_detected"]
 * - hostname 매칭 시 해당 parser, 매칭 실패 시 generic fallback (D-06)
 * - 파서 내부 예외는 try-catch로 감싸 warnings에 담고 부분 데이터 반환
 */
export function dispatchScraper(url: string, html: string): ScrapeResponse {
  const $ = load(html)
  const hostname = safeHostname(url)
  const entry = HOSTNAME_REGISTRY.find((r) => r.match(hostname))
  const provider: ProviderCode = entry?.provider ?? "UNKNOWN"

  // SPA / empty body 단락 평가
  if (isSpaEmpty($)) {
    return {
      data: emptyEvent(url),
      warnings: ["spa_detected"],
      _scraped: false,
      _provider: provider,
    }
  }

  let result: ParserResult
  try {
    const parser: ScraperFn = entry?.parser ?? scrapeGeneric
    result = parser($, url)
  } catch {
    // 파서 내부 예외는 부분 성공 원칙 위반 — warning으로 강등
    result = {
      event: emptyEventBase(),
      warnings: ["jsonld_parse_failed"],
    }
  }

  const hasAnyField = Boolean(
    result.event.title ||
      result.event.summary ||
      result.event.imageUrl ||
      result.event.startDate ||
      result.event.endDate,
  )

  return {
    data: {
      ...result.event,
      brandId: null,
      sourceUrl: url,
    },
    warnings: result.warnings,
    _scraped: hasAnyField,
    _provider: provider,
  }
}

function safeHostname(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return ""
  }
}

function emptyEventBase(): ParserResult["event"] {
  return {
    title: null,
    brandCandidate: null,
    startDate: null,
    endDate: null,
    imageUrl: null,
    summary: null,
    benefitText: null,
    discountAmount: null,
    categorySuggestion: null,
  }
}

function emptyEvent(url: string): ScrapedEvent {
  return {
    ...emptyEventBase(),
    brandId: null,
    sourceUrl: url,
  }
}
