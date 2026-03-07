import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

const BRANDS = [
  { slug: "mcdonalds", name_ko: "맥도날드", normalized_name: "mcdonalds", website_url: "https://www.mcdonalds.co.kr" },
  { slug: "burgerking", name_ko: "버거킹", normalized_name: "burgerking", website_url: "https://www.burgerking.co.kr" },
  { slug: "parisbaguette", name_ko: "파리바게뜨", normalized_name: "parisbaguette", website_url: "https://www.paris.co.kr" },
  { slug: "touslsjours", name_ko: "뚜레쥬르", normalized_name: "touslsjours", website_url: "https://www.tlj.co.kr" },
  { slug: "daiso", name_ko: "다이소", normalized_name: "daiso", website_url: "https://www.daiso.co.kr" },
  { slug: "musinsa", name_ko: "무신사", normalized_name: "musinsa", website_url: "https://www.musinsa.com" },
  { slug: "29cm", name_ko: "29CM", normalized_name: "29cm", website_url: "https://www.29cm.co.kr" },
  { slug: "greencar", name_ko: "그린카", normalized_name: "greencar", website_url: "https://www.greencar.co.kr" },
  { slug: "coupang", name_ko: "쿠팡", normalized_name: "coupang", website_url: "https://www.coupang.com" },
  { slug: "homeplus", name_ko: "홈플러스", normalized_name: "homeplus", website_url: "https://www.homeplus.co.kr" },
  { slug: "costco", name_ko: "코스트코", normalized_name: "costco", website_url: "https://www.costco.co.kr" },
  { slug: "twosome", name_ko: "투썸플레이스", normalized_name: "twosome", website_url: "https://www.twosome.co.kr" },
  { slug: "hollys", name_ko: "할리스", normalized_name: "hollys", website_url: "https://www.hollys.co.kr" },
  { slug: "innisfree", name_ko: "이니스프리", normalized_name: "innisfree", website_url: "https://www.innisfree.com" },
  { slug: "kakaot", name_ko: "카카오T", normalized_name: "kakaot", website_url: "https://www.kakaomobility.com" },
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
  // 네이버페이 8건
  {
    slug: "naverpay-yogiyo-15pct-202603", title: "네이버페이 요기요 15% 할인",
    summary: "요기요에서 네이버페이 결제 시 15% 즉시 할인, 최대 4천원",
    providerCode: "NAVERPAY", categorySlug: "delivery", brandSlug: "yogiyo",
    benefit_text: "15% 즉시 할인 (최대 4,000원)",
    condition_text: "네이버페이 결제 시\n12,000원 이상 주문\n월 3회 사용 가능\n치킨/피자 카테고리 제외",
    max_benefit_value: 4000, start_date: "2026-03-01", end_date: "2026-03-31",
    is_online: true, is_offline: false, source_url: "https://new-m.pay.naver.com/benefits", priority: 4,
  },
  {
    slug: "naverpay-mcdonalds-20pct-202603", title: "네이버페이 맥도날드 20% 할인",
    summary: "맥도날드 앱에서 네이버페이 결제 시 20% 할인",
    providerCode: "NAVERPAY", categorySlug: "delivery", brandSlug: "mcdonalds",
    benefit_text: "20% 즉시 할인 (최대 5,000원)",
    condition_text: "맥도날드 앱/맥딜리버리 주문\n네이버페이 결제\n8,000원 이상 주문 시\n월 2회 사용 가능",
    max_benefit_value: 5000, start_date: "2026-03-01", end_date: "2026-03-25",
    is_online: true, is_offline: false, source_url: "https://new-m.pay.naver.com/benefits", priority: 5,
  },
  {
    slug: "naverpay-twosome-3000-202603", title: "네이버페이 투썸플레이스 3,000원 할인",
    summary: "투썸플레이스 매장에서 네이버페이 결제 시 3,000원 할인",
    providerCode: "NAVERPAY", categorySlug: "cafe", brandSlug: "twosome",
    benefit_text: "3,000원 즉시 할인",
    condition_text: "네이버페이 현장결제 시\n8,000원 이상 결제\n기간 내 1회",
    max_benefit_value: 3000, start_date: "2026-03-01", end_date: "2026-03-10",
    is_online: false, is_offline: true, source_url: "https://new-m.pay.naver.com/benefits", priority: 2,
  },
  {
    slug: "naverpay-hollys-10pct-202603", title: "네이버페이 할리스 10% 할인",
    summary: "할리스 매장에서 네이버페이 결제 시 10% 할인",
    providerCode: "NAVERPAY", categorySlug: "cafe", brandSlug: "hollys",
    benefit_text: "10% 즉시 할인 (최대 2,000원)",
    condition_text: "네이버페이 현장결제\n5,000원 이상 결제\n일 1회, 월 5회",
    max_benefit_value: 2000, start_date: "2026-03-05", end_date: "2026-04-15",
    is_online: false, is_offline: true, source_url: "https://new-m.pay.naver.com/benefits", priority: 1,
  },
  {
    slug: "naverpay-musinsa-10pct-202603", title: "네이버페이 무신사 10% 할인",
    summary: "무신사 스토어에서 네이버페이 결제 시 10% 할인",
    providerCode: "NAVERPAY", categorySlug: "shopping", brandSlug: "musinsa",
    benefit_text: "10% 즉시 할인 (최대 10,000원)",
    condition_text: "무신사 스토어 온라인 결제\n네이버페이 결제 시\n30,000원 이상 주문\n월 1회 사용 가능",
    max_benefit_value: 10000, start_date: "2026-03-01", end_date: "2026-04-30",
    is_online: true, is_offline: false, source_url: "https://new-m.pay.naver.com/benefits", priority: 4,
  },
  {
    slug: "naverpay-29cm-5000-202603", title: "네이버페이 29CM 5,000원 할인",
    summary: "29CM에서 네이버페이 결제 시 5,000원 즉시 할인",
    providerCode: "NAVERPAY", categorySlug: "shopping", brandSlug: "29cm",
    benefit_text: "5,000원 즉시 할인",
    condition_text: "네이버페이 결제 시\n50,000원 이상 주문\n기간 내 1회",
    max_benefit_value: 5000, start_date: "2026-03-01", end_date: "2026-03-09",
    is_online: true, is_offline: false, source_url: "https://new-m.pay.naver.com/benefits", priority: 3,
  },
  {
    slug: "naverpay-cu-20pct-202603", title: "네이버페이 CU 20% 할인",
    summary: "CU 편의점에서 네이버페이 결제 시 20% 할인",
    providerCode: "NAVERPAY", categorySlug: "convenience", brandSlug: "cu",
    benefit_text: "20% 즉시 할인 (최대 3,000원)",
    condition_text: "네이버페이 바코드 결제\n5,000원 이상 결제\n일 1회\n담배/상품권 제외",
    max_benefit_value: 3000, start_date: "2026-03-05", end_date: "2026-03-20",
    is_online: false, is_offline: true, source_url: "https://new-m.pay.naver.com/benefits", priority: 1,
  },
  {
    slug: "naverpay-homeplus-7000-202603", title: "네이버페이 홈플러스 7,000원 할인",
    summary: "홈플러스에서 네이버페이 결제 시 7,000원 할인",
    providerCode: "NAVERPAY", categorySlug: "mart", brandSlug: "homeplus",
    benefit_text: "7,000원 즉시 할인",
    condition_text: "네이버페이 결제 시\n50,000원 이상 결제\n온/오프라인 동일 적용\n월 2회",
    max_benefit_value: 7000, start_date: "2026-03-03", end_date: "2026-04-10",
    is_online: true, is_offline: true, source_url: "https://new-m.pay.naver.com/benefits", priority: 2,
  },
  // 토스페이 8건
  {
    slug: "tosspay-baemin-5000-202603", title: "토스페이 배달의민족 5,000원 할인",
    summary: "배달의민족에서 토스페이 결제 시 5,000원 즉시 할인",
    providerCode: "TOSSPAY", categorySlug: "delivery", brandSlug: "baemin",
    benefit_text: "5,000원 즉시 할인",
    condition_text: "토스페이 결제 시\n20,000원 이상 주문\n월 1회 사용 가능\nB마트 주문 제외",
    max_benefit_value: 5000, start_date: "2026-03-01", end_date: "2026-04-15",
    is_online: true, is_offline: false, source_url: "https://toss.im/pay/event", priority: 5,
  },
  {
    slug: "tosspay-yogiyo-3000-202603", title: "토스페이 요기요 3,000원 할인",
    summary: "요기요에서 토스페이 결제 시 3,000원 즉시 할인",
    providerCode: "TOSSPAY", categorySlug: "delivery", brandSlug: "yogiyo",
    benefit_text: "3,000원 즉시 할인",
    condition_text: "토스페이 결제 시\n15,000원 이상 주문\n월 2회",
    max_benefit_value: 3000, start_date: "2026-03-05", end_date: "2026-03-31",
    is_online: true, is_offline: false, source_url: "https://toss.im/pay/event", priority: 1,
  },
  {
    slug: "tosspay-starbucks-15pct-202603", title: "토스페이 스타벅스 15% 할인",
    summary: "스타벅스에서 토스페이 결제 시 15% 할인, 최대 3천원",
    providerCode: "TOSSPAY", categorySlug: "cafe", brandSlug: "starbucks",
    benefit_text: "15% 즉시 할인 (최대 3,000원)",
    condition_text: "토스페이 현장결제 시\n5,000원 이상 결제\n일 1회\n드라이브스루 제외",
    max_benefit_value: 3000, start_date: "2026-03-01", end_date: "2026-03-08",
    is_online: false, is_offline: true, source_url: "https://toss.im/pay/event", priority: 3,
  },
  {
    slug: "tosspay-megacoffee-1500-202603", title: "토스페이 메가커피 1,500원 할인",
    summary: "메가커피에서 토스페이 결제 시 1,500원 할인",
    providerCode: "TOSSPAY", categorySlug: "cafe", brandSlug: "megacoffee",
    benefit_text: "1,500원 즉시 할인",
    condition_text: "토스페이 현장결제\n4,000원 이상 결제\n월 3회",
    max_benefit_value: 1500, start_date: "2026-03-01", end_date: "2026-04-20",
    is_online: false, is_offline: true, source_url: "https://toss.im/pay/event", priority: 1,
  },
  {
    slug: "tosspay-coupang-10pct-202603", title: "토스페이 쿠팡 10% 할인",
    summary: "쿠팡에서 토스페이 결제 시 10% 할인",
    providerCode: "TOSSPAY", categorySlug: "shopping", brandSlug: "coupang",
    benefit_text: "10% 즉시 할인 (최대 7,000원)",
    condition_text: "토스페이 결제 시\n30,000원 이상 주문\n로켓배송 상품 한정\n월 1회",
    max_benefit_value: 7000, start_date: "2026-03-01", end_date: "2026-04-30",
    is_online: true, is_offline: false, source_url: "https://toss.im/pay/event", priority: 4,
  },
  {
    slug: "tosspay-musinsa-7pct-202603", title: "토스페이 무신사 7% 할인",
    summary: "무신사에서 토스페이 결제 시 7% 할인 (종료)",
    providerCode: "TOSSPAY", categorySlug: "shopping", brandSlug: "musinsa",
    benefit_text: "7% 즉시 할인 (최대 5,000원)",
    condition_text: "토스페이 결제 시\n20,000원 이상\n월 1회",
    max_benefit_value: 5000, start_date: "2026-02-15", end_date: "2026-03-05",
    is_online: true, is_offline: false, source_url: "https://toss.im/pay/event", priority: 0,
  },
  {
    slug: "tosspay-oliveyoung-20pct-202603", title: "토스페이 올리브영 20% 할인",
    summary: "올리브영에서 토스페이 결제 시 20% 할인",
    providerCode: "TOSSPAY", categorySlug: "beauty", brandSlug: "oliveyoung",
    benefit_text: "20% 즉시 할인 (최대 8,000원)",
    condition_text: "토스페이 결제 시\n온라인몰/오프라인 매장 모두\n30,000원 이상 결제\n월 1회",
    max_benefit_value: 8000, start_date: "2026-03-01", end_date: "2026-04-15",
    is_online: true, is_offline: true, source_url: "https://toss.im/pay/event", priority: 2,
  },
  {
    slug: "tosspay-kakaot-30pct-202603", title: "토스페이 카카오T 30% 할인",
    summary: "카카오T 택시에서 토스페이 결제 시 30% 할인",
    providerCode: "TOSSPAY", categorySlug: "transport", brandSlug: "kakaot",
    benefit_text: "30% 즉시 할인 (최대 5,000원)",
    condition_text: "카카오T 택시 호출\n토스페이 결제 시\n일반호출만 해당\n월 3회",
    max_benefit_value: 5000, start_date: "2026-03-01", end_date: "2026-03-31",
    is_online: true, is_offline: false, source_url: "https://toss.im/pay/event", priority: 2,
  },
  // 카카오페이 8건
  {
    slug: "kakaopay-baemin-15pct-202603", title: "카카오페이 배달의민족 15% 할인",
    summary: "배달의민족에서 카카오페이 결제 시 15% 즉시 할인",
    providerCode: "KAKAOPAY", categorySlug: "delivery", brandSlug: "baemin",
    benefit_text: "15% 즉시 할인 (최대 5,000원)",
    condition_text: "카카오페이 결제 시\n15,000원 이상 주문\n월 2회\n배민1 주문 제외",
    max_benefit_value: 5000, start_date: "2026-03-01", end_date: "2026-04-10",
    is_online: true, is_offline: false, source_url: "https://www.kakaopay.com/pages/benefits", priority: 4,
  },
  {
    slug: "kakaopay-coupangeats-4000-202603", title: "카카오페이 쿠팡이츠 4,000원 할인",
    summary: "쿠팡이츠에서 카카오페이 결제 시 4,000원 할인",
    providerCode: "KAKAOPAY", categorySlug: "delivery", brandSlug: "coupangeats",
    benefit_text: "4,000원 즉시 할인",
    condition_text: "카카오페이 결제 시\n18,000원 이상 주문\n월 2회",
    max_benefit_value: 4000, start_date: "2026-03-03", end_date: "2026-03-25",
    is_online: true, is_offline: false, source_url: "https://www.kakaopay.com/pages/benefits", priority: 2,
  },
  {
    slug: "kakaopay-starbucks-20pct-202603", title: "카카오페이 스타벅스 20% 할인",
    summary: "스타벅스에서 카카오페이 결제 시 20% 할인 - 오늘 마지막!",
    providerCode: "KAKAOPAY", categorySlug: "cafe", brandSlug: "starbucks",
    benefit_text: "20% 즉시 할인 (최대 4,000원)",
    condition_text: "카카오페이 현장결제 시\n5,000원 이상 결제\n일 1회",
    max_benefit_value: 4000, start_date: "2026-03-01", end_date: "2026-03-07",
    is_online: false, is_offline: true, source_url: "https://www.kakaopay.com/pages/benefits", priority: 3,
  },
  {
    slug: "kakaopay-parisbaguette-3000-202603", title: "카카오페이 파리바게뜨 3,000원 할인",
    summary: "파리바게뜨에서 카카오페이 결제 시 3,000원 할인",
    providerCode: "KAKAOPAY", categorySlug: "cafe", brandSlug: "parisbaguette",
    benefit_text: "3,000원 즉시 할인",
    condition_text: "카카오페이 현장결제\n10,000원 이상 결제\n월 2회",
    max_benefit_value: 3000, start_date: "2026-03-05", end_date: "2026-04-20",
    is_online: false, is_offline: true, source_url: "https://www.kakaopay.com/pages/benefits", priority: 1,
  },
  {
    slug: "kakaopay-coupang-5000-202603", title: "카카오페이 쿠팡 5,000원 할인",
    summary: "쿠팡에서 카카오페이 결제 시 5,000원 즉시 할인",
    providerCode: "KAKAOPAY", categorySlug: "shopping", brandSlug: "coupang",
    benefit_text: "5,000원 즉시 할인",
    condition_text: "카카오페이 결제 시\n30,000원 이상 주문\n로켓배송 상품 한정\n월 2회",
    max_benefit_value: 5000, start_date: "2026-03-01", end_date: "2026-04-15",
    is_online: true, is_offline: false, source_url: "https://www.kakaopay.com/pages/benefits", priority: 5,
  },
  {
    slug: "kakaopay-daiso-15pct-202603", title: "카카오페이 다이소 15% 할인",
    summary: "다이소에서 카카오페이 결제 시 15% 할인",
    providerCode: "KAKAOPAY", categorySlug: "shopping", brandSlug: "daiso",
    benefit_text: "15% 즉시 할인 (최대 2,000원)",
    condition_text: "카카오페이 바코드 결제\n5,000원 이상 결제\n일 1회",
    max_benefit_value: 2000, start_date: "2026-03-01", end_date: "2026-03-31",
    is_online: false, is_offline: true, source_url: "https://www.kakaopay.com/pages/benefits", priority: 2,
  },
  {
    slug: "kakaopay-cu-10pct-202603", title: "카카오페이 CU 10% 할인",
    summary: "CU 편의점에서 카카오페이 결제 시 10% 할인",
    providerCode: "KAKAOPAY", categorySlug: "convenience", brandSlug: "cu",
    benefit_text: "10% 즉시 할인 (최대 2,000원)",
    condition_text: "카카오페이 바코드 결제\n3,000원 이상 결제\n일 1회\n담배/상품권 제외",
    max_benefit_value: 2000, start_date: "2026-03-01", end_date: "2026-04-05",
    is_online: false, is_offline: true, source_url: "https://www.kakaopay.com/pages/benefits", priority: 1,
  },
  {
    slug: "kakaopay-homeplus-10000-202603", title: "카카오페이 홈플러스 10,000원 할인",
    summary: "홈플러스에서 카카오페이 결제 시 10,000원 할인",
    providerCode: "KAKAOPAY", categorySlug: "mart", brandSlug: "homeplus",
    benefit_text: "10,000원 즉시 할인",
    condition_text: "카카오페이 결제 시\n70,000원 이상 결제\n온/오프라인 동일\n월 1회",
    max_benefit_value: 10000, start_date: "2026-03-01", end_date: "2026-04-30",
    is_online: true, is_offline: true, source_url: "https://www.kakaopay.com/pages/benefits", priority: 3,
  },
  // 페이코 6건
  {
    slug: "payco-baemin-2000-202603", title: "페이코 배달의민족 2,000원 할인",
    summary: "배달의민족에서 페이코 결제 시 2,000원 할인",
    providerCode: "PAYCO", categorySlug: "delivery", brandSlug: "baemin",
    benefit_text: "2,000원 즉시 할인",
    condition_text: "페이코 결제 시\n12,000원 이상 주문\n월 3회",
    max_benefit_value: 2000, start_date: "2026-03-01", end_date: "2026-03-31",
    is_online: true, is_offline: false, source_url: "https://www.payco.com/benefit/eventList.nhn", priority: 1,
  },
  {
    slug: "payco-burgerking-30pct-202603", title: "페이코 버거킹 30% 할인",
    summary: "버거킹에서 페이코 결제 시 30% 할인",
    providerCode: "PAYCO", categorySlug: "delivery", brandSlug: "burgerking",
    benefit_text: "30% 즉시 할인 (최대 5,000원)",
    condition_text: "페이코 결제 시\n버거킹 앱/딜리버리 주문\n10,000원 이상\n월 2회",
    max_benefit_value: 5000, start_date: "2026-03-05", end_date: "2026-04-10",
    is_online: true, is_offline: true, source_url: "https://www.payco.com/benefit/eventList.nhn", priority: 3,
  },
  {
    slug: "payco-coupang-8pct-202603", title: "페이코 쿠팡 8% 할인",
    summary: "쿠팡에서 페이코 결제 시 8% 할인",
    providerCode: "PAYCO", categorySlug: "shopping", brandSlug: "coupang",
    benefit_text: "8% 즉시 할인 (최대 5,000원)",
    condition_text: "페이코 결제 시\n20,000원 이상 주문\n로켓배송 한정\n월 1회",
    max_benefit_value: 5000, start_date: "2026-03-10", end_date: "2026-04-25",
    is_online: true, is_offline: false, source_url: "https://www.payco.com/benefit/eventList.nhn", priority: 2,
  },
  {
    slug: "payco-musinsa-5000-202603", title: "페이코 무신사 5,000원 할인",
    summary: "무신사에서 페이코 결제 시 5,000원 할인 (종료)",
    providerCode: "PAYCO", categorySlug: "shopping", brandSlug: "musinsa",
    benefit_text: "5,000원 즉시 할인",
    condition_text: "페이코 결제 시\n30,000원 이상 주문\n월 1회",
    max_benefit_value: 5000, start_date: "2026-02-10", end_date: "2026-03-04",
    is_online: true, is_offline: false, source_url: "https://www.payco.com/benefit/eventList.nhn", priority: 0,
  },
  {
    slug: "payco-gs25-20pct-202603", title: "페이코 GS25 20% 할인",
    summary: "GS25 편의점에서 페이코 결제 시 20% 할인",
    providerCode: "PAYCO", categorySlug: "convenience", brandSlug: "gs25",
    benefit_text: "20% 즉시 할인 (최대 3,000원)",
    condition_text: "페이코 바코드 결제\n5,000원 이상 결제\n일 1회\n담배/상품권 제외",
    max_benefit_value: 3000, start_date: "2026-03-01", end_date: "2026-04-15",
    is_online: false, is_offline: true, source_url: "https://www.payco.com/benefit/eventList.nhn", priority: 1,
  },
  {
    slug: "payco-greencar-40pct-202603", title: "페이코 그린카 40% 할인",
    summary: "그린카에서 페이코 결제 시 40% 할인",
    providerCode: "PAYCO", categorySlug: "transport", brandSlug: "greencar",
    benefit_text: "40% 즉시 할인 (최대 15,000원)",
    condition_text: "페이코 결제 시\n그린카 앱에서 예약\n첫 이용 고객 한정\n기간 내 1회",
    max_benefit_value: 15000, start_date: "2026-03-01", end_date: "2026-04-20",
    is_online: true, is_offline: false, source_url: "https://www.payco.com/benefit/eventList.nhn", priority: 2,
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

  console.log("\n=== 이벤트 upsert (30건) ===")
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

  // 검증
  const { count } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("status", "published")
  console.log(`\n총 published 이벤트: ${count}건`)
}

main().catch(console.error)
