import Link from "next/link"
import { SectionHeader } from "@/components/SectionHeader"
import { Badge } from "@/components/ui/badge"
import { formatKRW } from "@/lib/utils/money"
import { PROVIDER_BADGE_COLORS } from "@/lib/constants/providers"
import type { EventWithRelations } from "@/lib/types/event"

type PopularSectionProps = {
  events: EventWithRelations[]
}

export function PopularSection({ events }: PopularSectionProps) {
  if (events.length === 0) return null

  return (
    <section>
      <SectionHeader
        title="이번 주 많이 본 이벤트"
        subtitle="다른 사람들이 주목한 혜택"
        href="/events?sort=popular"
      />
      <div className="mt-4 space-y-2">
        {events.map((event, index) => {
          const providerCode = event.payment_provider?.code ?? ""
          const providerColor =
            PROVIDER_BADGE_COLORS[providerCode] ?? "bg-gray-500 text-white"

          return (
            <Link
              key={event.id}
              href={`/events/${event.slug}`}
              className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <Badge className={`${providerColor} text-[10px] px-1.5`}>
                    {event.payment_provider?.name_ko ?? "결제사"}
                  </Badge>
                  <span className="truncate text-sm font-medium">
                    {event.title}
                  </span>
                </div>
              </div>
              {event.max_benefit_value && (
                <span className="shrink-0 text-xs font-medium text-primary">
                  최대 {formatKRW(event.max_benefit_value)}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
