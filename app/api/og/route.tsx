import { ImageResponse } from "@vercel/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

const notoSansKRPromise = fetch(
  new URL(
    "https://fonts.gstatic.com/s/notosanskr/v36/PbykFmXiEBPT4ITbgNA5Cgm203Tq4JJWq209pU0DPdWuqxJco4.0.woff2"
  )
).then((res) => res.arrayBuffer())

const PROVIDER_COLORS: Record<string, { bg: string; text: string }> = {
  NAVERPAY: { bg: "#03C75A", text: "#FFFFFF" },
  TOSSPAY: { bg: "#0064FF", text: "#FFFFFF" },
  KAKAOPAY: { bg: "#FEE500", text: "#191919" },
  PAYCO: { bg: "#E52528", text: "#FFFFFF" },
}

const PROVIDER_NAMES: Record<string, string> = {
  NAVERPAY: "네이버페이",
  TOSSPAY: "토스페이",
  KAKAOPAY: "카카오페이",
  PAYCO: "페이코",
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const title = searchParams.get("title") ?? "간편결제 이벤트 허브"
  const provider = searchParams.get("provider") ?? ""

  const colors = PROVIDER_COLORS[provider] ?? { bg: "#1a1a2e", text: "#FFFFFF" }
  const providerName = PROVIDER_NAMES[provider] ?? ""

  let fontData: ArrayBuffer | undefined
  try {
    fontData = await notoSansKRPromise
  } catch {
    // 폰트 로딩 실패 시 기본 sans-serif로 fallback
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.bg}dd 100%)`,
          padding: "60px 80px",
        }}
      >
        {providerName && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "24px",
              padding: "8px 24px",
              borderRadius: "999px",
              backgroundColor: "rgba(255,255,255,0.2)",
              color: colors.text,
              fontSize: "28px",
              fontWeight: 600,
              fontFamily: "'Noto Sans KR', sans-serif",
            }}
          >
            {providerName}
          </div>
        )}
        <div
          style={{
            display: "flex",
            textAlign: "center",
            color: colors.text,
            fontSize: title.length > 30 ? "42px" : "52px",
            fontWeight: 800,
            lineHeight: 1.3,
            maxWidth: "900px",
            wordBreak: "keep-all",
            fontFamily: "'Noto Sans KR', sans-serif",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "40px",
            color: colors.text,
            opacity: 0.8,
            fontSize: "24px",
            fontWeight: 500,
            fontFamily: "'Noto Sans KR', sans-serif",
          }}
        >
          PayEvents — 간편결제 이벤트 허브
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fontData
        ? [{ name: "Noto Sans KR", data: fontData, weight: 700, style: "normal" as const }]
        : undefined,
    }
  )
}
