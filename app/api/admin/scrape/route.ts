import { NextRequest, NextResponse } from "next/server"
import { z } from "zod/v4"
import { fetchHtml } from "@/lib/utils/fetch-html"

function verifyAdmin(request: NextRequest): boolean {
  const secret = request.headers.get("x-admin-secret")
  return secret === process.env.ADMIN_SECRET_KEY
}

const scrapeSchema = z.object({
  url: z.string().url("유효한 URL이 필요합니다"),
})

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const parsed = scrapeSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((i) => i.message).join(", ") },
      { status: 400 }
    )
  }

  try {
    const html = await fetchHtml(parsed.data.url)
    const meta = extractMeta(html)

    const bodyImages = extractBodyImages(html, parsed.data.url)

    return NextResponse.json({
      data: {
        title: meta.title,
        description: meta.description,
        image: meta.image,
        siteName: meta.siteName,
        bodyImages,
        url: parsed.data.url,
      },
    })
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "URL을 가져오는 중 오류가 발생했습니다"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

function extractMeta(html: string) {
  const get = (pattern: RegExp): string => {
    const match = html.match(pattern)
    return match?.[1]?.trim() ?? ""
  }

  const ogTitle = get(/<meta[^>]+property="og:title"[^>]+content="([^"]*)"/)
    || get(/<meta[^>]+content="([^"]*)"[^>]+property="og:title"/)
  const ogDesc = get(/<meta[^>]+property="og:description"[^>]+content="([^"]*)"/)
    || get(/<meta[^>]+content="([^"]*)"[^>]+property="og:description"/)
  const ogImage = get(/<meta[^>]+property="og:image"[^>]+content="([^"]*)"/)
    || get(/<meta[^>]+content="([^"]*)"[^>]+property="og:image"/)
  const ogSiteName = get(/<meta[^>]+property="og:site_name"[^>]+content="([^"]*)"/)
    || get(/<meta[^>]+content="([^"]*)"[^>]+property="og:site_name"/)

  const metaTitle = get(/<title[^>]*>([^<]+)<\/title>/)
  const metaDesc = get(/<meta[^>]+name="description"[^>]+content="([^"]*)"/)
    || get(/<meta[^>]+content="([^"]*)"[^>]+name="description"/)

  return {
    title: ogTitle || metaTitle,
    description: ogDesc || metaDesc,
    image: ogImage,
    siteName: ogSiteName,
  }
}

/** 본문 영역에서 의미 있는 이미지 URL을 추출 */
function extractBodyImages(html: string, pageUrl: string): string[] {
  const origin = new URL(pageUrl).origin
  const seen = new Set<string>()
  const images: string[] = []

  function addImage(src: string) {
    let fullUrl = src
    if (src.startsWith("//")) fullUrl = "https:" + src
    else if (src.startsWith("/")) fullUrl = origin + src
    else if (!src.startsWith("http")) return

    if (seen.has(fullUrl)) return
    if (isJunkImage(fullUrl)) return
    seen.add(fullUrl)
    images.push(fullUrl)
  }

  // 1) JSON-LD structured data에서 이미지 추출 (가장 정확)
  const jsonLdRegex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
  let jsonLdMatch
  while ((jsonLdMatch = jsonLdRegex.exec(html)) !== null) {
    try {
      const data = JSON.parse(jsonLdMatch[1])
      const ldImages = Array.isArray(data.image) ? data.image : data.image ? [data.image] : []
      for (const img of ldImages) {
        if (typeof img === "string") addImage(img)
      }
    } catch { /* JSON 파싱 실패 무시 */ }
  }

  // 2) 본문 컨테이너 영역에서 img 추출 (사이트별 패턴)
  const contentPatterns = [
    // 루리웹
    /<div[^>]*class="[^"]*view_content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<div/i,
    // 뽐뿌
    /<td[^>]*class="[^"]*board-contents[^"]*"[^>]*>([\s\S]*?)<\/td>/i,
    // 클리앙
    /<div[^>]*class="[^"]*post_article[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<div/i,
    // 일반: article 태그
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    // 일반: main content 영역
    /<div[^>]*class="[^"]*(?:article[_-]?(?:body|content|view)|post[_-]?(?:body|content|view)|entry[_-]?content|content[_-]?body)[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
  ]

  let contentHtml = ""
  for (const pattern of contentPatterns) {
    const contentMatch = html.match(pattern)
    if (contentMatch?.[1]) {
      contentHtml = contentMatch[1]
      break
    }
  }

  // 본문 컨테이너를 못 찾으면 전체 HTML 사용하되 필터를 강화
  const targetHtml = contentHtml || html
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/gi
  let match
  while ((match = imgRegex.exec(targetHtml)) !== null) {
    const tag = match[0]
    const srcVal = match[1]

    // 본문 컨테이너 없이 전체 HTML을 쓸 때는 작은 이미지 엄격 제외
    if (!contentHtml) {
      const w = tag.match(/width[=:]\s*"?(\d+)/i)
      const h = tag.match(/height[=:]\s*"?(\d+)/i)
      if (w && parseInt(w[1]) < 100) continue
      if (h && parseInt(h[1]) < 100) continue
    }

    addImage(srcVal)
  }

  return images.slice(0, 20)
}

function isJunkImage(url: string): boolean {
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
