import type { SupabaseClient } from "@supabase/supabase-js"
import type { BrandRow } from "@/lib/supabase/types"

export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^\w가-힣]/g, "")
}

export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w가-힣-]/g, "")
}

type ResolvedBrand = Pick<BrandRow, "id" | "slug" | "name_ko">

export async function resolveBrand(
  brandName: string,
  supabase: SupabaseClient
): Promise<ResolvedBrand | null> {
  if (!brandName.trim()) return null

  const normalized = normalizeName(brandName)

  const { data: existing } = await supabase
    .from("brands")
    .select("id, slug, name_ko")
    .eq("normalized_name", normalized)
    .maybeSingle()

  if (existing) return existing as ResolvedBrand

  const slug = nameToSlug(brandName)

  const { data: created, error } = await supabase
    .from("brands")
    .insert({
      slug,
      name_ko: brandName,
      normalized_name: normalized,
      is_active: true,
    })
    .select("id, slug, name_ko")
    .single()

  if (error) throw new Error(`브랜드 생성 실패: ${error.message}`)

  return created as ResolvedBrand
}
