type CategorySlug =
  | "delivery"
  | "cafe"
  | "shopping"
  | "convenience"
  | "mart"
  | "beauty"
  | "transport"

// 브랜드 이름 → category slug (우선 매핑)
const BRAND_TO_CATEGORY: Record<string, CategorySlug> = {
  "스타벅스": "cafe",
  "투썸": "cafe",
  "투썸플레이스": "cafe",
  "메가커피": "cafe",
  "이디야": "cafe",
  "컴포즈": "cafe",
  "배민": "delivery",
  "배달의민족": "delivery",
  "쿠팡이츠": "delivery",
  "요기요": "delivery",
  "쿠팡": "shopping",
  "11번가": "shopping",
  "G마켓": "shopping",
  "옥션": "shopping",
  "인터파크": "shopping",
  "CU": "convenience",
  "GS25": "convenience",
  "세븐일레븐": "convenience",
  "이마트24": "convenience",
  "이마트": "mart",
  "홈플러스": "mart",
  "롯데마트": "mart",
  "올리브영": "beauty",
  "시코르": "beauty",
  "GS칼텍스": "transport",
  "SK에너지": "transport",
}

// Fallback 키워드 (브랜드 매칭 실패 시)
const CATEGORY_KEYWORDS: Record<CategorySlug, string[]> = {
  delivery: ["배달"],
  cafe: ["카페", "커피", "디저트"],
  shopping: ["쇼핑", "쇼핑몰"],
  convenience: ["편의점"],
  mart: ["마트"],
  beauty: ["뷰티", "화장품"],
  transport: ["주유", "지하철", "택시"],
}

/**
 * 제목과 브랜드 후보 문자열로부터 카테고리 slug를 추론한다.
 * 브랜드 매핑이 키워드 매핑보다 우선 (Pitfall 7: "스타벅스 배달" → cafe, not delivery).
 * 반환값은 CATEGORIES의 value 중 하나거나 null.
 */
export function inferCategory(
  title: string | null,
  brandCandidate: string | null,
): string | null {
  const haystack = `${title ?? ""} ${brandCandidate ?? ""}`

  // 1) 브랜드 매핑 우선
  for (const [brand, slug] of Object.entries(BRAND_TO_CATEGORY)) {
    if (haystack.includes(brand)) return slug
  }

  // 2) 키워드 fallback
  for (const [slug, kws] of Object.entries(CATEGORY_KEYWORDS)) {
    if (kws.some((k) => haystack.includes(k))) return slug
  }

  return null
}
