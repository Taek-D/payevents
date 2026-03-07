export const PROVIDERS = [
  { value: "NAVERPAY", label: "네이버페이", color: "#03C75A" },
  { value: "TOSSPAY", label: "토스페이", color: "#0064FF" },
  { value: "KAKAOPAY", label: "카카오페이", color: "#FEE500" },
  { value: "PAYCO", label: "페이코", color: "#E52528" },
] as const

export type Provider = (typeof PROVIDERS)[number]["value"]

export const PROVIDER_BADGE_COLORS: Record<string, string> = {
  NAVERPAY: "bg-[#03C75A] text-white",
  TOSSPAY: "bg-[#0064FF] text-white",
  KAKAOPAY: "bg-[#FEE500] text-gray-900",
  PAYCO: "bg-[#E52528] text-white",
}
