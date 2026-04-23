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

/**
 * Lookup-only 브랜드 조회. 존재하지 않으면 null을 반환하며, 결코 INSERT 하지 않는다.
 * scrape 라우트는 자동으로 새 브랜드를 만들지 않아야 하므로 (D-10) 이 함수만 사용한다.
 * 이벤트 실제 저장 시점(events POST)에서는 기존 resolveBrand를 써서 필요시 생성한다.
 */
export async function findBrandByNormalizedName(
  brandName: string,
  supabase: SupabaseClient,
): Promise<ResolvedBrand | null> {
  const trimmed = brandName.trim()
  if (!trimmed) return null
  const normalized = normalizeName(trimmed)
  const { data } = await supabase
    .from("brands")
    .select("id, slug, name_ko")
    .eq("normalized_name", normalized)
    .maybeSingle()
  return (data as ResolvedBrand | null) ?? null
}
