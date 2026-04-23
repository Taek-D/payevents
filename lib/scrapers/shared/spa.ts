import type { CheerioAPI } from "cheerio"

/**
 * SPA/빈 HTML 감지 — D-11 locked decision.
 * 세 조건 모두 참이어야 true (엄격 AND). 하나라도 단서가 있으면 부분 추출을 시도한다.
 */
export function isSpaEmpty($: CheerioAPI): boolean {
  const bodyLen = $("body").text().replace(/\s+/g, "").length
  const hasOgTitle = !!$('meta[property="og:title"]').attr("content")?.trim()
  const hasJsonLd = $('script[type="application/ld+json"]').length > 0
  return bodyLen < 500 && !hasOgTitle && !hasJsonLd
}
