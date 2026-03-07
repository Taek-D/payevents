import { SectionHeader } from "@/components/SectionHeader"
import { EventCard } from "@/components/EventCard"
import type { EventWithRelations } from "@/lib/types/event"

type FeaturedSectionProps = {
  events: EventWithRelations[]
}

export function FeaturedSection({ events }: FeaturedSectionProps) {
  if (events.length === 0) return null

  return (
    <section>
      <SectionHeader
        title="오늘의 추천 이벤트"
        subtitle="지금 가장 주목할 혜택"
        href="/events"
      />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  )
}
