"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EventFilters, type EventFiltersProps } from "@/components/EventFilters"

export function EventFiltersWrapper(props: EventFiltersProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      {/* Mobile-only toggle — hidden at sm+ */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="flex w-full items-center justify-between sm:hidden"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls="event-filters-panel"
      >
        <span className="flex items-center gap-2">
          <Filter className="h-4 w-4" aria-hidden="true" />
          필터
        </span>
        {expanded ? (
          <ChevronUp className="h-4 w-4" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        )}
      </Button>

      {/* Filter panel: on mobile toggle drives visibility; on sm+ always visible */}
      <div
        id="event-filters-panel"
        className={`${expanded ? "mt-4 block" : "hidden"} sm:mt-0 sm:block`}
      >
        <EventFilters {...props} />
      </div>
    </div>
  )
}
