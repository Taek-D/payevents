"use client"

import { EventCard } from "@/components/EventCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import type { EventWithRelations } from "@/lib/types/event"

type EventListProps = {
  events: EventWithRelations[]
  isLoading: boolean
  hasMore: boolean
  onLoadMore: () => void
  onResetFilters?: () => void
}

function EventCardSkeleton() {
  return (
    <div className="rounded-xl border p-4 space-y-3">
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

export function EventList({
  events,
  isLoading,
  hasMore,
  onLoadMore,
  onResetFilters,
}: EventListProps) {
  if (isLoading && events.length === 0) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="text-4xl" role="img" aria-label="검색 결과 없음">
          🔍
        </span>
        <p className="mt-3 text-lg font-medium text-muted-foreground">
          조건에 맞는 이벤트가 없어요
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          다른 조건으로 검색해 보세요
        </p>
        {onResetFilters && (
          <Button variant="outline" className="mt-4" onClick={onResetFilters}>
            필터 초기화
          </Button>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
        {isLoading &&
          Array.from({ length: 2 }).map((_, i) => (
            <EventCardSkeleton key={`skeleton-${i}`} />
          ))}
      </div>
      {hasMore && !isLoading && (
        <div className="mt-6 flex justify-center">
          <Button variant="outline" onClick={onLoadMore}>
            더 보기
          </Button>
        </div>
      )}
    </div>
  )
}
