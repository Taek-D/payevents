export type BenefitInfo = {
  benefitText: string | null
  discountAmount: number | null // 최대 혜택 값 (원 단위). 퍼센트는 null로 두고 benefitText로만 표현.
}

// "20% 할인", "10% 캐시백"
const PERCENT_PATTERN = /(\d{1,3})\s*%\s*(?:할인|캐시백|적립|환급|리워드)/

// "5,000원 할인" / "10,000원 청구할인" / "500원 적립"
const WON_PATTERN =
  /([0-9]{1,3}(?:,[0-9]{3})+|\d+)\s*원\s*(?:할인|청구할인|캐시백|적립|환급|리워드)/

/**
 * "N% 할인" / "N,NNN원 적립" 등 한국어 혜택 문구를 추출.
 * 퍼센트와 원 매치가 모두 있으면 퍼센트를 우선한다 (보통 주요 혜택이 앞에 온다).
 */
export function parseBenefit(text: string): BenefitInfo {
  if (!text) return { benefitText: null, discountAmount: null }

  const pct = text.match(PERCENT_PATTERN)
  const won = text.match(WON_PATTERN)

  if (pct) {
    return {
      benefitText: `${pct[1]}% ${extractBenefitVerb(pct[0])}`,
      discountAmount: null,
    }
  }
  if (won) {
    const amount = parseInt(won[1].replace(/,/g, ""), 10)
    return {
      benefitText: `${won[1]}원 ${extractBenefitVerb(won[0])}`,
      discountAmount:
        Number.isFinite(amount) && amount > 0 ? amount : null,
    }
  }
  return { benefitText: null, discountAmount: null }
}

function extractBenefitVerb(match: string): string {
  const verbs = ["청구할인", "캐시백", "적립", "환급", "리워드", "할인"]
  for (const v of verbs) if (match.includes(v)) return v
  return "할인"
}
