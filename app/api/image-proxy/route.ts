import { NextRequest, NextResponse } from "next/server"

/** 핫링크 차단 우회를 위한 이미지 프록시 */

// 정확한 호스트명 매칭 (기존 커뮤니티)
const ALLOWED_HOSTS = [
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

// 접미사 매칭 — 결제사 CDN (서브도메인 다수)
const ALLOWED_HOST_SUFFIXES = [
  "pstatic.net", // 네이버 (shop-phinf, phinf, post-phinf 등)
  "kakaocdn.net", // 카카오 (t1.kakaocdn.net 등)
  "toss-static.com", // 토스 (legacy CDN)
  "toss.im", // 토스 자사 (static.toss.im 등)
  "static.payco.com", // 페이코 static 서브도메인
  "cdn.toastoven.net", // 페이코 CDN (NHN Cloud, payco-cdn.cdn.toastoven.net 등)
  "pay.naver.com", // 네이버페이 자체 호스트
]

function isAllowedHost(hostname: string): boolean {
  if (ALLOWED_HOSTS.includes(hostname)) return true
  return ALLOWED_HOST_SUFFIXES.some(
    (suffix) => hostname === suffix || hostname.endsWith("." + suffix),
  )
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")

  if (!url) {
    return NextResponse.json(
      { error: "url 파라미터가 필요합니다" },
      { status: 400 },
    )
  }

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return NextResponse.json({ error: "유효한 URL이 아닙니다" }, { status: 400 })
  }

  if (!isAllowedHost(parsed.hostname)) {
    return NextResponse.json(
      { error: "허용되지 않은 도메인입니다" },
      { status: 403 },
    )
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
      return NextResponse.json(
        { error: `이미지 로딩 실패: ${res.status}` },
        { status: 502 },
      )
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
    return NextResponse.json(
      { error: "이미지를 가져올 수 없습니다" },
      { status: 502 },
    )
  }
}
