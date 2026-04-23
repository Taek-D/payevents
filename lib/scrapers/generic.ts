import type { CheerioAPI } from "cheerio"
import type { ParserResult, ScrapeWarning } from "./index"
import { extractJsonLdOffers, firstOfferImage } from "./shared/jsonld"
import { getOgMeta, getMetaDescription, getDocumentTitle } from "./shared/og"
import { normalizeImageUrl, collectBodyImages } from "./shared/image"

/**
 * Provider-agnostic fallback: JSON-LD Offer → OG meta → <title>/description 순.
 * Plan 02-02에서 결제사별 파서가 내부 helper로 이 함수를 재사용해도 좋다.
 */
export function scrapeGeneric($: CheerioAPI, url: string): ParserResult {
  const warnings: ScrapeWarning[] = []
  const jsonLd = extractJsonLdOffers($)
  if (jsonLd.parseFailed) warnings.push("jsonld_parse_failed")
  const firstOffer = jsonLd.offers[0]

  const title =
    firstOffer?.name?.trim() ||
    getOgMeta($, "title") ||
    getDocumentTitle($) ||
    null
  if (!title) warnings.push("title_missing")

  const summary =
    firstOffer?.description?.trim() ||
    getOgMeta($, "description") ||
    getMetaDescription($) ||
    null

  const offerImage = firstOfferImage(firstOffer)
  const ogImage = getOgMeta($, "image")
  const imageCandidate =
    (offerImage && normalizeImageUrl(offerImage, url)) ||
    (ogImage && normalizeImageUrl(ogImage, url)) ||
    collectBodyImages($, url)[0] ||
    null
  if (!imageCandidate) warnings.push("image_not_found")

  // 기간/혜택/카테고리 추론은 Plan 02-02에서 결제사별로 확장.
  // generic fallback은 일단 null로 두고 해당 warnings만 기록한다.
  warnings.push("period_not_found")
  warnings.push("category_unknown")

  return {
    event: {
      title,
      brandCandidate: null,
      startDate: null,
      endDate: null,
      imageUrl: imageCandidate,
      summary,
      benefitText: null,
      discountAmount: null,
      categorySuggestion: null,
    },
    warnings,
  }
}
