import Link from "next/link"
import { SectionHeader } from "@/components/SectionHeader"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatEndingBadge, formatDateRange, getEndingUrgencyLevel } from "@/lib/utils/date"
import { PROVIDER_BADGE_COLORS } from "@/lib/constants/providers"
import type { EventWithRelations } from "@/lib/types/event"

const URGENCY_STYLES: Record<string, string> = {
  critical: "bg-red-100 text-red-700 animate-pulse font-bold",
  warning: "bg-orange-100 text-orange-700 font-bold",
}

type EndingSoonSectionProps = {
  events: EventWithRelations[]
}

export function EndingSoonSection({ events }: EndingSoonSectionProps) {
  if (events.length === 0) return null

  return (
    <section>
      <SectionHeader
        title="종료 임박"
        subtitle="놓치면 아쉬운 이벤트"
        href="/events?sort=ending_soon"
      />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {events.map((event) => {
          const providerCode = event.payment_provider?.code ?? ""
          const providerColor =
            PROVIDER_BADGE_COLORS[providerCode] ?? "bg-gray-500 text-white"
          const endingBadge = formatEndingBadge(event.end_date)
          const urgency = getEndingUrgencyLevel(event.end_date)
          const badgeStyle = URGENCY_STYLES[urgency] ?? "bg-red-100 text-red-700 font-bold"

          return (
            <Link
              key={event.id}
              href={`/events/${event.slug}`}
              className="block"
            >
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge className={providerColor}>
                      {event.payment_provider?.name_ko ?? "결제사"}
                    </Badge>
                    {endingBadge && (
                      <Badge className={badgeStyle}>
                        {endingBadge}
                      </Badge>
                    )}
                  </div>
                  <h3 className="mt-2 text-sm font-semibold leading-snug line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDateRange(event.start_date, event.end_date)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
