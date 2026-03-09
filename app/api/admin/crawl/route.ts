import { NextRequest, NextResponse } from "next/server"
import { fetchHtml } from "@/lib/utils/fetch-html"

function verifyAdmin(request: NextRequest): boolean {
  const secret = request.headers.get("x-admin-secret")
  return secret === process.env.ADMIN_SECRET_KEY
}

const PAY_KEYWORDS = [
  "네이버페이", "네이버 페이", "naverpay",
  "토스페이", "토스 페이", "토스pay", "tosspay",
  "카카오페이", "카카오 페이", "kakaopay",
  "페이코", "payco",
]

type CrawledPost = {
  title: string
  url: string
  source: string
  matchedKeywords: string[]
}

type BoardConfig = {
  name: string
  url: string
  baseUrl: string
  parser: (html: string, baseUrl: string) => { title: string; href: string }[]
}

const BOARDS: BoardConfig[] = [
  {
    name: "뽐뿌 이벤트",
    url: "https://www.ppomppu.co.kr/zboard/zboard.php?id=event2",
    baseUrl: "https://www.ppomppu.co.kr/zboard/",
    parser: parsePpomppu,
  },
  {
    name: "클리앙 알뜰구매",
    url: "https://www.clien.net/service/board/jirum",
    baseUrl: "https://www.clien.net",
    parser: parseClien,
  },
  {
    name: "루리웹 핫딜",
    url: "https://bbs.ruliweb.com/market/board/1020",
    baseUrl: "https://bbs.ruliweb.com",
    parser: parseRuliweb,
  },
]

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const results: CrawledPost[] = []
  const errors: string[] = []

  const crawlPromises = BOARDS.map(async (board) => {
    try {
      const html = await fetchHtml(board.url)
      const posts = board.parser(html, board.baseUrl)

      for (const post of posts) {
        const titleLower = post.title.toLowerCase()
        const matched = PAY_KEYWORDS.filter((kw) =>
          titleLower.includes(kw.toLowerCase())
        )
        if (matched.length > 0) {
          results.push({
            title: post.title,
            url: post.href,
            source: board.name,
            matchedKeywords: matched,
          })
        }
      }
    } catch (err) {
      errors.push(
        `${board.name}: ${err instanceof Error ? err.message : "알 수 없는 오류"}`
      )
    }
  })

  await Promise.all(crawlPromises)

  // 중복 제거 (같은 URL)
  const seen = new Set<string>()
  const unique = results.filter((r) => {
    if (seen.has(r.url)) return false
    seen.add(r.url)
    return true
  })

  return NextResponse.json({
    data: unique,
    meta: {
      total: unique.length,
      sources: BOARDS.map((b) => b.name),
      errors: errors.length > 0 ? errors : undefined,
      crawledAt: new Date().toISOString(),
    },
  })
}

function parsePpomppu(
  html: string,
  baseUrl: string
): { title: string; href: string }[] {
  const posts: { title: string; href: string }[] = []

  // 뽐뿌 게시판: <a href="view.php?id=...&no=...">제목</a>
  const regex =
    /<a[^>]+href="(view\.php\?id=event2[^"]*)"[^>]*>[\s\S]*?<font[^>]*>([\s\S]*?)<\/font>/g
  let match

  while ((match = regex.exec(html)) !== null) {
    const href = match[1]
    const title = match[2]
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .trim()

    if (title && href) {
      posts.push({
        title,
        href: href.startsWith("http") ? href : `${baseUrl}${href}`,
      })
    }
  }

  // 대체 파싱: 기본 a 태그에서 직접 추출
  if (posts.length === 0) {
    const altRegex =
      /<a[^>]+href="(view\.php\?id=event2[^"]*)"[^>]*>([\s\S]*?)<\/a>/g

    while ((match = altRegex.exec(html)) !== null) {
      const href = match[1]
      const title = match[2]
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .trim()

      if (title.length > 5 && href) {
        posts.push({
          title,
          href: href.startsWith("http") ? href : `${baseUrl}${href}`,
        })
      }
    }
  }

  return posts
}

function parseClien(
  html: string,
  baseUrl: string
): { title: string; href: string }[] {
  const posts: { title: string; href: string }[] = []

  // 클리앙: <a href="/service/board/jirum/NNNNN?...">제목</a> (클래스 없음)
  const regex =
    /<a[^>]*href="(\/service\/board\/jirum\/\d+[^"]*)"[^>]*>([\s\S]*?)<\/a>/g
  let match

  while ((match = regex.exec(html)) !== null) {
    const href = match[1]
    const title = match[2]
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .trim()

    if (title && title.length > 3 && href) {
      posts.push({
        title,
        href: `${baseUrl}${href}`,
      })
    }
  }

  return posts
}

function parseRuliweb(
  html: string,
  baseUrl: string
): { title: string; href: string }[] {
  const posts: { title: string; href: string }[] = []

  // 루리웹: <a class="subject_link" href="/market/board/1020/read/NNNNN?">제목</a>
  const regex =
    /<a[^>]*class="[^"]*subject_link[^"]*"[^>]*href="([^"]*\/read\/[^"]*)"[^>]*>([\s\S]*?)<\/a>/g
  let match

  while ((match = regex.exec(html)) !== null) {
    const href = match[1]
    const title = match[2]
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .trim()

    if (title && title.length > 3 && href) {
      posts.push({
        title,
        href: href.startsWith("http") ? href : `${baseUrl}${href}`,
      })
    }
  }

  return posts
}
