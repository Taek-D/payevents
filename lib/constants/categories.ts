export const CATEGORIES = [
  { value: "delivery", label: "배달/음식" },
  { value: "cafe", label: "카페/디저트" },
  { value: "shopping", label: "쇼핑" },
  { value: "convenience", label: "편의점" },
  { value: "mart", label: "마트/생활" },
  { value: "beauty", label: "뷰티/패션" },
  { value: "transport", label: "교통/주유" },
] as const

export type Category = (typeof CATEGORIES)[number]["value"]
