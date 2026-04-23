import type { CheerioAPI } from "cheerio"

/** og:{key} → name="og:{key}" → twitter:{key} 순서로 fallback */
export function getOgMeta($: CheerioAPI, key: string): string | null {
  const v =
    $(`meta[property="og:${key}"]`).attr("content")?.trim() ||
    $(`meta[name="og:${key}"]`).attr("content")?.trim() ||
    $(`meta[name="twitter:${key}"]`).attr("content")?.trim()
  return v && v.length > 0 ? v : null
}

export function getMetaDescription($: CheerioAPI): string | null {
  const v = $('meta[name="description"]').attr("content")?.trim()
  return v && v.length > 0 ? v : null
}

export function getDocumentTitle($: CheerioAPI): string | null {
  const v = $("title").text().trim()
  return v && v.length > 0 ? v : null
}
