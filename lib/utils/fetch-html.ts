export type FetchHtmlOptions = {
  headers?: Record<string, string>
  timeoutMs?: number  // default 10_000 — crawl 라우트 호환 유지
}

/**
 * HTML을 가져오면서 인코딩(EUC-KR 등)을 자동 감지하여 올바르게 디코딩합니다.
 */
export async function fetchHtml(
  url: string,
  opts: FetchHtmlOptions = {},
): Promise<string> {
  const { headers: extraHeaders, timeoutMs = 10_000 } = opts
  const origin = new URL(url).origin
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
      Referer: origin + "/",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      ...extraHeaders,
    },
    redirect: "follow",
    signal: AbortSignal.timeout(timeoutMs),
  })

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }

  return decodeResponse(res)
}

async function decodeResponse(res: Response): Promise<string> {
  const contentType = res.headers.get("content-type") ?? ""
  const charsetMatch = contentType.match(/charset=([^\s;]+)/i)
  const buffer = await res.arrayBuffer()

  if (charsetMatch) {
    const charset = charsetMatch[1].toLowerCase()
    if (charset !== "utf-8" && charset !== "utf8") {
      return new TextDecoder(charset).decode(buffer)
    }
  }

  const utf8Text = new TextDecoder("utf-8").decode(buffer)
  const metaCharset =
    utf8Text.match(/<meta[^>]+charset="?([^"\s;>]+)/i)?.[1] ??
    utf8Text.match(/<meta[^>]+content="[^"]*charset=([^"\s;>]+)/i)?.[1]

  if (metaCharset) {
    const charset = metaCharset.toLowerCase()
    if (charset !== "utf-8" && charset !== "utf8") {
      return new TextDecoder(charset).decode(buffer)
    }
  }

  return utf8Text
}
