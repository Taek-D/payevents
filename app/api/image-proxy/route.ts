import { NextRequest, NextResponse } from "next/server"

/** 핫링크 차단 우회를 위한 이미지 프록시 */

const ALLOWED_DOMAINS = [
  "i1.ruliweb.com",
  "i2.ruliweb.com",
  "i3.ruliweb.com",
  "i4.ruliweb.com",
  "img.ruliweb.com",
  "www.ppomppu.co.kr",
  "static.ppomppu.co.kr",
  "image.fmkorea.com",
  "www.clien.net",
  "img.clien.net",
]

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "url 파라미터가 필요합니다" }, { status: 400 })
  }

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return NextResponse.json({ error: "유효한 URL이 아닙니다" }, { status: 400 })
  }

  if (!ALLOWED_DOMAINS.includes(parsed.hostname)) {
    return NextResponse.json({ error: "허용되지 않은 도메인입니다" }, { status: 403 })
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Referer: parsed.origin + "/",
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!res.ok) {
      return NextResponse.json({ error: `이미지 로딩 실패: ${res.status}` }, { status: 502 })
    }

    const contentType = res.headers.get("content-type") ?? "image/jpeg"
    const buffer = await res.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    })
  } catch {
    return NextResponse.json({ error: "이미지를 가져올 수 없습니다" }, { status: 502 })
  }
}
