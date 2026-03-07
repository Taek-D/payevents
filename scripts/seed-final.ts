import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

const BRANDS = [
  { slug: "aritaum", name_ko: "아리따움", normalized_name: "aritaum", website_url: "https://www.aritaum.com" },
  { slug: "socar", name_ko: "쏘카", normalized_name: "socar", website_url: "https://www.socar.kr" },
  { slug: "emart", name_ko: "이마트", normalized_name: "emart", website_url: "https://www.emart.com" },
  { slug: "lotteria", name_ko: "롯데리아", normalized_name: "lotteria", website_url: "https://www.lotteria.com" },
]

type EventSeed = {
  slug: string
  title: string
  summary: string
  providerCode: string
  categorySlug: string
  brandSlug: string
  benefit_text: string
  condition_text: string
  max_benefit_value: number | null
  start_date: string
  end_date: string
  is_online: boolean
  is_offline: boolean
  source_url: string
  priority: number
}

const EVENTS: EventSeed[] = [
  {
    slug: "naverpay-innisfree-15pct-202603", title: "네이버페이 이니스프리 15% 할인",
    summary: "이니스프리 온라인몰에서 네이버페이 결제 시 15% 할인",
    providerCode: "NAVERPAY", categorySlug: "beauty", brandSlug: "innisfree",
    benefit_text: "15% 즉시 할인 (최대 5,000원)",
    condition_text: "네이버페이 결제 시\n20,000원 이상 결제\n월 2회",
    max_benefit_value: 5000, start_date: "2026-03-05", end_date: "2026-04-15",
    is_online: true, is_offline: false, source_url: "https://new-m.pay.naver.com/benefits", priority: 2,
  },
  {
    slug: "naverpay-socar-25pct-202603", title: "네이버페이 쏘카 25% 할인",
    summary: "쏘카 앱에서 네이버페이 결제 시 25% 할인",
    providerCode: "NAVERPAY", categorySlug: "transport", brandSlug: "socar",
    benefit_text: "25% 즉시 할인 (최대 10,000원)",
    condition_text: "네이버페이 결제 시\n쏘카 앱에서 예약\n50,000원 이상 이용\n월 1회",
    max_benefit_value: 10000, start_date: "2026-03-01", end_date: "2026-03-31",
    is_online: true, is_offline: false, source_url: "https://new-m.pay.naver.com/benefits", priority: 3,
  },
  {
    slug: "tosspay-gs25-15pct-202603", title: "토스페이 GS25 15% 할인",
    summary: "GS25 편의점에서 토스페이 결제 시 15% 할인",
    providerCode: "TOSSPAY", categorySlug: "convenience", brandSlug: "gs25",
    benefit_text: "15% 즉시 할인 (최대 2,500원)",
    condition_text: "토스페이 현장결제\n5,000원 이상 결제\n일 1회\n담배/상품권 제외",
    max_benefit_value: 2500, start_date: "2026-03-03", end_date: "2026-04-10",
    is_online: false, is_offline: true, source_url: "https://toss.im/pay/event", priority: 2,
  },
  {
    slug: "tosspay-emart-8000-202603", title: "토스페이 이마트 8,000원 할인",
    summary: "이마트에서 토스페이 결제 시 8,000원 할인",
    providerCode: "TOSSPAY", categorySlug: "mart", brandSlug: "emart",
    benefit_text: "8,000원 즉시 할인",
    condition_text: "토스페이 결제 시\n50,000원 이상 결제\n온/오프라인 동일\n월 2회",
    max_benefit_value: 8000, start_date: "2026-03-01", end_date: "2026-04-20",
    is_online: true, is_offline: true, source_url: "https://toss.im/pay/event", priority: 3,
  },
  {
    slug: "kakaopay-aritaum-20pct-202603", title: "카카오페이 아리따움 20% 할인",
    summary: "아리따움에서 카카오페이 결제 시 20% 할인",
    providerCode: "KAKAOPAY", categorySlug: "beauty", brandSlug: "aritaum",
    benefit_text: "20% 즉시 할인 (최대 6,000원)",
    condition_text: "카카오페이 결제 시\n온/오프라인 모두\n20,000원 이상 결제\n월 2회",
    max_benefit_value: 6000, start_date: "2026-03-05", end_date: "2026-04-25",
    is_online: true, is_offline: true, source_url: "https://www.kakaopay.com/pages/benefits", priority: 2,
  },
  {
    slug: "kakaopay-socar-30pct-202603", title: "카카오페이 쏘카 30% 할인",
    summary: "쏘카에서 카카오페이 결제 시 30% 할인",
    providerCode: "KAKAOPAY", categorySlug: "transport", brandSlug: "socar",
    benefit_text: "30% 즉시 할인 (최대 12,000원)",
    condition_text: "카카오페이 결제 시\n쏘카 앱 예약\n40,000원 이상 이용\n월 1회",
    max_benefit_value: 12000, start_date: "2026-03-01", end_date: "2026-04-15",
    is_online: true, is_offline: false, source_url: "https://www.kakaopay.com/pages/benefits", priority: 4,
  },
  {
    slug: "payco-twosome-2000-202603", title: "페이코 투썸플레이스 2,000원 할인",
    summary: "투썸플레이스에서 페이코 결제 시 2,000원 할인",
    providerCode: "PAYCO", categorySlug: "cafe", brandSlug: "twosome",
    benefit_text: "2,000원 즉시 할인",
    condition_text: "페이코 현장결제\n7,000원 이상 결제\n월 3회",
    max_benefit_value: 2000, start_date: "2026-03-05", end_date: "2026-04-20",
    is_online: false, is_offline: true, source_url: "https://www.payco.com/benefit/eventList.nhn", priority: 1,
  },
  {
    slug: "payco-homeplus-5000-202603", title: "페이코 홈플러스 5,000원 할인",
    summary: "홈플러스에서 페이코 결제 시 5,000원 할인",
    providerCode: "PAYCO", categorySlug: "mart", brandSlug: "homeplus",
    benefit_text: "5,000원 즉시 할인",
    condition_text: "페이코 결제 시\n40,000원 이상 결제\n온/오프라인 동일\n월 2회",
    max_benefit_value: 5000, start_date: "2026-03-01", end_date: "2026-04-10",
    is_online: true, is_offline: true, source_url: "https://www.payco.com/benefit/eventList.nhn", priority: 2,
  },
  {
    slug: "payco-oliveyoung-15pct-202603", title: "페이코 올리브영 15% 할인",
    summary: "올리브영에서 페이코 결제 시 15% 할인",
    providerCode: "PAYCO", categorySlug: "beauty", brandSlug: "oliveyoung",
    benefit_text: "15% 즉시 할인 (최대 5,000원)",
    condition_text: "페이코 결제 시\n온라인/오프라인 모두\n20,000원 이상 결제\n월 1회",
    max_benefit_value: 5000, start_date: "2026-03-03", end_date: "2026-04-15",
    is_online: true, is_offline: true, source_url: "https://www.payco.com/benefit/eventList.nhn", priority: 3,
  },
  {
    slug: "tosspay-innisfree-25pct-202603", title: "토스페이 이니스프리 25% 할인",
    summary: "이니스프리 온라인에서 토스페이 결제 시 25% 할인",
    providerCode: "TOSSPAY", categorySlug: "beauty", brandSlug: "innisfree",
    benefit_text: "25% 즉시 할인 (최대 8,000원)",
    condition_text: "토스페이 결제 시\n온라인몰 한정\n25,000원 이상 결제\n월 1회",
    max_benefit_value: 8000, start_date: "2026-03-10", end_date: "2026-04-30",
    is_online: true, is_offline: false, source_url: "https://toss.im/pay/event", priority: 4,
  },
  {
    slug: "naverpay-emart-10000-202603", title: "네이버페이 이마트 10,000원 할인",
    summary: "이마트에서 네이버페이 결제 시 10,000원 할인",
    providerCode: "NAVERPAY", categorySlug: "mart", brandSlug: "emart",
    benefit_text: "10,000원 즉시 할인",
    condition_text: "네이버페이 결제 시\n60,000원 이상 결제\n온/오프라인 동일\n월 1회",
    max_benefit_value: 10000, start_date: "2026-03-01", end_date: "2026-03-31",
    is_online: true, is_offline: true, source_url: "https://new-m.pay.naver.com/benefits", priority: 5,
  },
  {
    slug: "kakaopay-gs25-15pct-202603", title: "카카오페이 GS25 15% 할인",
    summary: "GS25에서 카카오페이 결제 시 15% 할인",
    providerCode: "KAKAOPAY", categorySlug: "convenience", brandSlug: "gs25",
    benefit_text: "15% 즉시 할인 (최대 2,000원)",
    condition_text: "카카오페이 바코드 결제\n5,000원 이상 결제\n일 1회\n담배/상품권 제외",
    max_benefit_value: 2000, start_date: "2026-03-01", end_date: "2026-04-05",
    is_online: false, is_offline: true, source_url: "https://www.kakaopay.com/pages/benefits", priority: 1,
  },
]

async function main() {
  console.log("=== 브랜드 upsert ===")
  for (const brand of BRANDS) {
    const { error } = await supabase
      .from("brands")
      .upsert(brand, { onConflict: "slug" })
    if (error) {
      console.error(`  [FAIL] ${brand.name_ko}: ${error.message}`)
    } else {
      console.log(`  [OK] ${brand.name_ko}`)
    }
  }

  console.log("\n=== ID 매핑 조회 ===")
  const { data: providers } = await supabase.from("payment_providers").select("id, code")
  const { data: categories } = await supabase.from("categories").select("id, slug")
  const { data: brands } = await supabase.from("brands").select("id, slug")

  if (!providers || !categories || !brands) {
    console.error("마스터 데이터 조회 실패")
    process.exit(1)
  }

  const providerMap = Object.fromEntries(providers.map((p) => [p.code, p.id]))
  const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]))
  const brandMap = Object.fromEntries(brands.map((b) => [b.slug, b.id]))

  console.log(`  providers: ${providers.length}, categories: ${categories.length}, brands: ${brands.length}`)

  console.log("\n=== 이벤트 upsert (12건) ===")
  let successCount = 0
  let failCount = 0

  for (const ev of EVENTS) {
    const providerId = providerMap[ev.providerCode]
    const categoryId = categoryMap[ev.categorySlug]
    const brandId = brandMap[ev.brandSlug]

    if (!providerId || !categoryId || !brandId) {
      console.error(`  [SKIP] ${ev.slug}: 매핑 실패 (provider=${!!providerId}, category=${!!categoryId}, brand=${!!brandId})`)
      failCount++
      continue
    }

    const { error } = await supabase.from("events").upsert(
      {
        slug: ev.slug,
        title: ev.title,
        summary: ev.summary,
        payment_provider_id: providerId,
        category_id: categoryId,
        brand_id: brandId,
        benefit_text: ev.benefit_text,
        condition_text: ev.condition_text,
        max_benefit_value: ev.max_benefit_value,
        stacking_possible: false,
        start_date: ev.start_date,
        end_date: ev.end_date,
        is_online: ev.is_online,
        is_offline: ev.is_offline,
        source_url: ev.source_url,
        source_type: "official" as const,
        is_verified: true,
        status: "published" as const,
        priority: ev.priority,
        published_at: new Date().toISOString(),
      },
      { onConflict: "slug" }
    )

    if (error) {
      console.error(`  [FAIL] ${ev.slug}: ${error.message}`)
      failCount++
    } else {
      console.log(`  [OK] ${ev.title}`)
      successCount++
    }
  }

  console.log(`\n=== 완료: ${successCount}건 성공, ${failCount}건 실패 ===`)

  const { count } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("status", "published")
  console.log(`\n총 published 이벤트: ${count}건`)
}

main().catch(console.error)
