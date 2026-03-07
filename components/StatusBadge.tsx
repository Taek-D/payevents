import { Badge } from "@/components/ui/badge"
import { getDaysUntilEnd, getEndingUrgencyLevel } from "@/lib/utils/date"
import type { EventStatus } from "@/lib/supabase/types"

type StatusBadgeProps = {
  endDate: string
  status?: EventStatus
}

export function StatusBadge({ endDate, status }: StatusBadgeProps) {
  const urgency = getEndingUrgencyLevel(endDate)

  if (status === "archived" || urgency === "expired") {
    return (
      <Badge className="bg-gray-100 text-gray-600">종료</Badge>
    )
  }

  if (urgency === "critical") {
    const days = getDaysUntilEnd(endDate)
    const label = days === 0 ? "오늘 종료" : "D-1"
    return (
      <Badge className="bg-red-100 text-red-700 animate-pulse font-bold">
        {label}
      </Badge>
    )
  }

  if (urgency === "warning") {
    const days = getDaysUntilEnd(endDate)
    return (
      <Badge className="bg-orange-100 text-orange-700 font-bold">
        D-{days}
      </Badge>
    )
  }

  return null
}
