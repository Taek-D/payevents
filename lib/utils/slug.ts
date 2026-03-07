import { format } from "date-fns"
import type { SupabaseClient } from "@supabase/supabase-js"

export function generateEventSlug(
  providerCode: string,
  brandSlug: string,
  date: Date = new Date()
): string {
  const yyyymm = format(date, "yyyyMM")
  return `${providerCode.toLowerCase()}-${brandSlug}-${yyyymm}`
}

export async function ensureUniqueSlug(
  baseSlug: string,
  supabase: SupabaseClient
): Promise<string> {
  const { data } = await supabase
    .from("events")
    .select("slug")
    .like("slug", `${baseSlug}%`)

  if (!data || data.length === 0) return baseSlug

  const existing = new Set(data.map((e: { slug: string }) => e.slug))
  if (!existing.has(baseSlug)) return baseSlug

  let suffix = 2
  while (existing.has(`${baseSlug}-${suffix}`)) {
    suffix++
  }
  return `${baseSlug}-${suffix}`
}
