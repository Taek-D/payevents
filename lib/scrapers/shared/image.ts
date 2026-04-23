import type { CheerioAPI, Cheerio } from "cheerio"
import type { AnyNode } from "domhandler"

export function isJunkImage(url: string): boolean {
  const lower = url.toLowerCase()
  return (
    lower.includes("1x1") ||
    lower.includes("pixel") ||
    lower.includes("tracking") ||
    lower.includes("spacer") ||
    lower.includes("blank.") ||
    lower.includes("/icon") ||
    lower.includes("/emoji") ||
    lower.includes("/logo") ||
    lower.includes("/btn_") ||
    lower.includes("/button") ||
    lower.includes("gravatar.com") ||
    lower.includes("/avatar") ||
    lower.includes("/profile") ||
    lower.includes("ad.") ||
    lower.includes("/ads/") ||
    lower.startsWith("data:")
  )
}

/** //cdn/foo, /foo, https://foo 모두 절대 URL로 정규화. 실패 시 null. */
export function normalizeImageUrl(src: string, pageUrl: string): string | null {
  if (!src) return null
  try {
    if (src.startsWith("//")) return "https:" + src
    if (src.startsWith("/")) return new URL(pageUrl).origin + src
    if (src.startsWith("http")) return src
    return new URL(src, pageUrl).href
  } catch {
    return null
  }
}

/**
 * 본문 컨테이너 추적 후 img 수집. 컨테이너를 못 찾으면 전체 document에서 width/height ≥ 100 인 이미지만.
 * 최대 20개.
 */
export function collectBodyImages($: CheerioAPI, pageUrl: string): string[] {
  const seen = new Set<string>()
  const out: string[] = []

  const addImage = (raw: string | undefined) => {
    if (!raw) return
    const normalized = normalizeImageUrl(raw.trim(), pageUrl)
    if (!normalized) return
    if (isJunkImage(normalized)) return
    if (seen.has(normalized)) return
    seen.add(normalized)
    out.push(normalized)
  }

  // 1) 본문 컨테이너 우선 탐지 — 기존 regex 패턴 Cheerio selector로 이식
  const containers: string[] = [
    ".view_content",        // 루리웹
    "td.board-contents",    // 뽐뿌
    ".post_article",        // 클리앙
    "article",
    ".article-body, .article_content, .article-content, .article-view",
    ".post-body, .post_content, .post-content, .post-view",
    ".entry-content",
    ".content-body, .content_body",
  ]

  let containerEl: Cheerio<AnyNode> | null = null
  for (const sel of containers) {
    const el = $(sel).first()
    if (el.length > 0) {
      containerEl = el
      break
    }
  }

  if (containerEl) {
    containerEl.find("img").each((_, img) => addImage($(img).attr("src")))
  } else {
    // Fallback: document-wide, strict size gating
    $("img").each((_, img) => {
      const $img = $(img)
      const w = parseInt($img.attr("width") ?? "", 10)
      const h = parseInt($img.attr("height") ?? "", 10)
      if (!Number.isNaN(w) && w > 0 && w < 100) return
      if (!Number.isNaN(h) && h > 0 && h < 100) return
      addImage($img.attr("src"))
    })
  }

  return out.slice(0, 20)
}
