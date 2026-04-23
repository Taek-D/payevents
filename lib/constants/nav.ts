export const NAV_LINKS = [
  { href: "/home", label: "홈" },
  { href: "/events", label: "이벤트" },
  { href: "/categories", label: "카테고리" },
  { href: "/about", label: "소개" },
  { href: "/submit", label: "이벤트 제보" },
] as const

export type NavLink = (typeof NAV_LINKS)[number]
