import { parse, format, isValid } from "date-fns"

// 패턴 1: 2026.04.01 ~ 2026.04.30  또는  2026.04.01 ~ 04.30
// 하이픈(-)도 커버하므로 ISO 형식도 동일 패턴에 잡힘.
const PATTERN_FULL_RANGE =
  /(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})\s*[~\-–—]\s*(?:(\d{4})[.\-/])?(\d{1,2})[.\-/](\d{1,2})/

// 패턴 2: ~ 4/30까지  또는  부터 4/30
const PATTERN_UNTIL_SLASH = /(?:~|부터)\s*(\d{1,2})\/(\d{1,2})(?:까지)?/

// 패턴 3: 4월 30일 종료  또는  4월 30일까지
const PATTERN_KOREAN_UNTIL = /(\d{1,2})월\s*(\d{1,2})일\s*(?:까지|종료)/

export type ParsedPeriod = {
  startDate: string | null // "YYYY-MM-DD"
  endDate: string | null // "YYYY-MM-DD"
}

/**
 * 한국어 기간 텍스트를 `{startDate, endDate}` ISO 형식으로 파싱한다.
 * JSON-LD `validThrough`가 있으면 호출자가 먼저 사용하고, 이 helper는 본문 자유 텍스트 fallback에만 쓰인다.
 */
export function parseKoreanPeriod(
  text: string,
  now: Date = new Date(),
): ParsedPeriod {
  if (!text) return { startDate: null, endDate: null }
  const currentYear = now.getFullYear()

  const full = text.match(PATTERN_FULL_RANGE)
  if (full) {
    const [, sy, sm, sd, ey, em, ed] = full
    const startDate = toIso(sy, sm, sd)
    const endDate = toIso(ey ?? sy, em, ed)
    if (startDate && endDate && endDate >= startDate) {
      return { startDate, endDate }
    }
  }

  const until = text.match(PATTERN_UNTIL_SLASH)
  if (until) {
    const [, em, ed] = until
    const endDate = toIso(String(currentYear), em, ed)
    if (endDate) return { startDate: null, endDate }
  }

  const koreanUntil = text.match(PATTERN_KOREAN_UNTIL)
  if (koreanUntil) {
    const [, em, ed] = koreanUntil
    const endDate = toIso(String(currentYear), em, ed)
    if (endDate) return { startDate: null, endDate }
  }

  return { startDate: null, endDate: null }
}

/** JSON-LD validThrough / priceValidUntil 이 ISO 8601이면 바로 date-only ISO로 변환 */
export function isoDateOrNull(raw: string | undefined | null): string | null {
  if (!raw) return null
  const d = new Date(raw)
  if (!isValid(d)) return null
  return format(d, "yyyy-MM-dd")
}

function toIso(y: string, m: string, d: string): string | null {
  const padded = `${y.padStart(4, "20")}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`
  const parsed = parse(padded, "yyyy-MM-dd", new Date())
  return isValid(parsed) ? format(parsed, "yyyy-MM-dd") : null
}
