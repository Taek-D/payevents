"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/StatusBadge"
import { formatDateRange, isExpired } from "@/lib/utils/date"
import { formatKRW } from "@/lib/utils/money"
import { PROVIDER_BADGE_COLORS } from "@/lib/constants/providers"
import type { EventWithRelations } from "@/lib/types/event"

type EventCardProps = {
  event: EventWithRelations
  variant?: "default" | "compact"
}

export function EventCard({ event, variant = "default" }: EventCardProps) {
  const providerCode = event.payment_provider?.code ?? ""
  const providerColor = PROVIDER_BADGE_COLORS[providerCode] ?? "bg-gray-500 text-white"
  const expired = event.status === "archived" || isExpired(event.end_date)

  return (
    <Link href={`/events/${event.slug}`} className="block">
      <Card className={`transition-shadow hover:shadow-md ${expired ? "opacity-50 grayscale" : ""}`}>
        <CardContent className={variant === "compact" ? "p-3" : "p-4"}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge className={providerColor}>
                {event.payment_provider?.name_ko ?? "결제사"}
              </Badge>
              <Badge variant="outline">
                {event.category?.name_ko ?? "카테고리"}
              </Badge>
            </div>
            <StatusBadge endDate={event.end_date} status={event.status} />
          </div>

          <h3 className={`mt-2 font-semibold leading-snug ${variant === "compact" ? "text-sm" : "text-base"}`}>
            {event.title}
          </h3>

          {variant === "default" && event.summary && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {event.summary}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatDateRange(event.start_date, event.end_date)}</span>
            {event.max_benefit_value && (
              <span className="font-medium text-foreground">
                최대 {formatKRW(event.max_benefit_value)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
