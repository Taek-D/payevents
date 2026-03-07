import type { EventRow } from "@/lib/supabase/types"

export type EventWithRelations = EventRow & {
  payment_provider: { id: string; code: string; name_ko: string } | null
  category: { id: string; slug: string; name_ko: string } | null
  brand: { id: string; slug: string; name_ko: string } | null
}

export type EventFiltersState = {
  provider: string
  category: string
  sort: "latest" | "ending_soon" | "popular"
  q: string
  page: number
}
