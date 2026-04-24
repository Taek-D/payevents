"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { EventSearchBar } from "@/components/EventSearchBar"
import { EventFiltersWrapper } from "@/components/EventFiltersWrapper"
import { EventList } from "@/components/EventList"
import type { EventWithRelations, EventFiltersState } from "@/lib/types/event"

const DEFAULT_FILTERS: EventFiltersState = {
  provider: "",
  category: "",
  sort: "latest",
  q: "",
  page: 1,
}

export function EventsContainer() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [events, setEvents] = useState<EventWithRelations[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<EventFiltersState>({
    provider: searchParams.get("provider") ?? "",
    category: searchParams.get("category") ?? "",
    sort: (searchParams.get("sort") as EventFiltersState["sort"]) ?? "latest",
    q: searchParams.get("q") ?? "",
    page: 1,
  })

  const fetchEvents = useCallback(async (f: EventFiltersState, append = false) => {
    setIsLoading(true)
    const params = new URLSearchParams()
    if (f.provider) params.set("provider", f.provider)
    if (f.category) params.set("category", f.category)
    if (f.sort) params.set("sort", f.sort)
    if (f.q) params.set("q", f.q)
    params.set("page", String(f.page))
    params.set("limit", "20")

    try {
      const res = await fetch(`/api/events?${params.toString()}`)
      const json = await res.json()

      if (append) {
        setEvents((prev) => [...prev, ...json.data])
      } else {
        setEvents(json.data ?? [])
      }
      setTotal(json.total ?? 0)
    } catch {
      if (!append) {
        setEvents([])
        setTotal(0)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    fetchEvents(filters)
    return () => controller.abort()
  }, [filters, fetchEvents])

  const updateFilters = useCallback(
    (updates: Partial<EventFiltersState>) => {
      const next = { ...filters, ...updates }
      setFilters(next)

      const params = new URLSearchParams()
      if (next.provider) params.set("provider", next.provider)
      if (next.category) params.set("category", next.category)
      if (next.sort !== "latest") params.set("sort", next.sort)
      if (next.q) params.set("q", next.q)

      const qs = params.toString()
      router.push(qs ? `/events?${qs}` : "/events", { scroll: false })
    },
    [filters, router]
  )

  const handleSearch = useCallback(
    (q: string) => updateFilters({ q, page: 1 }),
    [updateFilters]
  )

  const handleLoadMore = useCallback(() => {
    const next = { ...filters, page: filters.page + 1 }
    setFilters(next)
    fetchEvents(next, true)
  }, [filters, fetchEvents])

  const handleResetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    router.push("/events", { scroll: false })
  }, [router])

  const hasMore = events.length < total

  return (
    <div className="space-y-6">
      <EventSearchBar onSearch={handleSearch} initialValue={filters.q} />
      <EventFiltersWrapper currentFilters={filters} onFilterChange={updateFilters} />
      <EventList
        events={events}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        onResetFilters={handleResetFilters}
      />
    </div>
  )
}
