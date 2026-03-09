import { differenceInDays, parseISO, startOfDay } from "date-fns"

export function getDaysUntilEnd(endDate: string): number {
  const end = startOfDay(parseISO(endDate))
  const today = startOfDay(new Date())
  return differenceInDays(end, today)
}

export function isEndingSoon(endDate: string, threshold = 3): boolean {
  const days = getDaysUntilEnd(endDate)
  return days >= 0 && days <= threshold
}

export function isExpired(endDate: string): boolean {
  return getDaysUntilEnd(endDate) < 0
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = parseISO(startDate)
  const end = parseISO(endDate)
  const sm = start.getMonth() + 1
  const sd = start.getDate()
  const em = end.getMonth() + 1
  const ed = end.getDate()
  return `${sm}월 ${sd}일 ~ ${em}월 ${ed}일`
}

export function formatEndingBadge(endDate: string): string | null {
  const days = getDaysUntilEnd(endDate)
  if (days < 0 || days > 3) return null
  if (days === 0) return "오늘 종료"
  return `D-${days}`
}

export type UrgencyLevel = "critical" | "warning" | "normal" | "expired"

export function getEndingUrgencyLevel(endDate: string): UrgencyLevel {
  const days = getDaysUntilEnd(endDate)
  if (days < 0) return "expired"
  if (days <= 1) return "critical"
  if (days <= 7) return "warning"
  return "normal"
}
