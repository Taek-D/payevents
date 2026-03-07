-- PayEvents 추가 시드 데이터 (Day 11)
-- seed.sql 실행 후 이 파일을 실행
-- 오늘 기준: 2026-03-07

-- ============================================================
-- 브랜드 추가 (15개)
-- ============================================================

insert into brands (slug, name_ko, normalized_name, website_url) values
  ('mcdonalds',      '맥도날드',         'mcdonalds',       'https://www.mcdonalds.co.kr'),
  ('burgerking',     '버거킹',          'burgerking',      'https://www.burgerking.co.kr'),
  ('parisbaguette',  '파리바게뜨',       'parisbaguette',   'https://www.paris.co.kr'),
  ('touslsjours',    '뚜레쥬르',        'touslsjours',     'https://www.tlj.co.kr'),
  ('daiso',          '다이소',          'daiso',           'https://www.daiso.co.kr'),
  ('musinsa',        '무신사',          'musinsa',         'https://www.musinsa.com'),
  ('29cm',           '29CM',            '29cm',            'https://www.29cm.co.kr'),
  ('greencar',       '그린카',          'greencar',        'https://www.greencar.co.kr'),
  ('coupang',        '쿠팡',            'coupang',         'https://www.coupang.com'),
  ('homeplus',       '홈플러스',        'homeplus',        'https://www.homeplus.co.kr'),
  ('costco',         '코스트코',        'costco',          'https://www.costco.co.kr'),
  ('twosome',        '투썸플레이스',     'twosome',         'https://www.twosome.co.kr'),
  ('hollys',         '할리스',          'hollys',          'https://www.hollys.co.kr'),
  ('innisfree',      '이니스프리',       'innisfree',       'https://www.innisfree.com'),
  ('kakaot',         '카카오T',         'kakaot',          'https://www.kakaomobility.com')
on conflict (slug) do update set
  name_ko         = excluded.name_ko,
  normalized_name = excluded.normalized_name,
  website_url     = excluded.website_url;

-- ============================================================
-- 이벤트 30건
-- ============================================================

insert into events (
  slug, title, summary,
  payment_provider_id, category_id, brand_id,
  benefit_text, condition_text, max_benefit_value,
  stacking_possible, start_date, end_date,
  is_online, is_offline, source_url, source_type,
  is_verified, status, priority, published_at
) values

-- ─────────────────────────────────────────────
-- 네이버페이 8건
-- ─────────────────────────────────────────────

-- 1. 네이버페이 요기요 15% 할인 (배달, priority 4)
(
  'naverpay-yogiyo-15pct-202603',
  '네이버페이 요기요 15% 할인',
  '요기요에서 네이버페이 결제 시 15% 즉시 할인, 최대 4천원',
  (select id from payment_providers where code = 'NAVERPAY'),
  (select id from categories where slug = 'delivery'),
  (select id from brands where slug = 'yogiyo'),
  '15% 즉시 할인 (최대 4,000원)',
  '네이버페이 결제 시
12,000원 이상 주문
월 3회 사용 가능
치킨/피자 카테고리 제외',
  4000, false,
  '2026-03-01', '2026-03-31',
  true, false,
  'https://new-m.pay.naver.com/benefits',
  'official', true, 'published', 4, now()
),

-- 2. 네이버페이 맥도날드 20% 할인 (배달, priority 5)
(
  'naverpay-mcdonalds-20pct-202603',
  '네이버페이 맥도날드 20% 할인',
  '맥도날드 앱에서 네이버페이 결제 시 20% 할인',
  (select id from payment_providers where code = 'NAVERPAY'),
  (select id from categories where slug = 'delivery'),
  (select id from brands where slug = 'mcdonalds'),
  '20% 즉시 할인 (최대 5,000원)',
  '맥도날드 앱/맥딜리버리 주문
네이버페이 결제
8,000원 이상 주문 시
월 2회 사용 가능',
  5000, false,
  '2026-03-01', '2026-03-25',
  true, false,
  'https://new-m.pay.naver.com/benefits',
  'official', true, 'published', 5, now()
),

-- 3. 네이버페이 투썸플레이스 3,000원 할인 (카페, D-3 종료임박)
(
  'naverpay-twosome-3000-202603',
  '네이버페이 투썸플레이스 3,000원 할인',
  '투썸플레이스 매장에서 네이버페이 결제 시 3,000원 할인',
  (select id from payment_providers where code = 'NAVERPAY'),
  (select id from categories where slug = 'cafe'),
  (select id from brands where slug = 'twosome'),
  '3,000원 즉시 할인',
  '네이버페이 현장결제 시
8,000원 이상 결제
기간 내 1회',
  3000, false,
  '2026-03-01', '2026-03-10',
  false, true,
  'https://new-m.pay.naver.com/benefits',
  'official', true, 'published', 2, now()
),

-- 4. 네이버페이 할리스 10% 할인 (카페)
(
  'naverpay-hollys-10pct-202603',
  '네이버페이 할리스 10% 할인',
  '할리스 매장에서 네이버페이 결제 시 10% 할인',
  (select id from payment_providers where code = 'NAVERPAY'),
  (select id from categories where slug = 'cafe'),
  (select id from brands where slug = 'hollys'),
  '10% 즉시 할인 (최대 2,000원)',
  '네이버페이 현장결제
5,000원 이상 결제
일 1회, 월 5회',
  2000, false,
  '2026-03-05', '2026-04-15',
  false, true,
  'https://new-m.pay.naver.com/benefits',
  'official', true, 'published', 1, now()
),

-- 5. 네이버페이 무신사 10% 할인 (쇼핑, priority 4)
(
  'naverpay-musinsa-10pct-202603',
  '네이버페이 무신사 10% 할인',
  '무신사 스토어에서 네이버페이 결제 시 10% 할인',
  (select id from payment_providers where code = 'NAVERPAY'),
  (select id from categories where slug = 'shopping'),
  (select id from brands where slug = 'musinsa'),
  '10% 즉시 할인 (최대 10,000원)',
  '무신사 스토어 온라인 결제
네이버페이 결제 시
30,000원 이상 주문
월 1회 사용 가능',
  10000, false,
  '2026-03-01', '2026-04-30',
  true, false,
  'https://new-m.pay.naver.com/benefits',
  'official', true, 'published', 4, now()
),

-- 6. 네이버페이 29CM 5,000원 할인 (쇼핑, D-2 종료임박)
(
  'naverpay-29cm-5000-202603',
  '네이버페이 29CM 5,000원 할인',
  '29CM에서 네이버페이 결제 시 5,000원 즉시 할인',
  (select id from payment_providers where code = 'NAVERPAY'),
  (select id from categories where slug = 'shopping'),
  (select id from brands where slug = '29cm'),
  '5,000원 즉시 할인',
  '네이버페이 결제 시
50,000원 이상 주문
기간 내 1회',
  5000, false,
  '2026-03-01', '2026-03-09',
  true, false,
  'https://new-m.pay.naver.com/benefits',
  'official', true, 'published', 3, now()
),

-- 7. 네이버페이 CU 20% 할인 (편의점)
(
  'naverpay-cu-20pct-202603',
  '네이버페이 CU 20% 할인',
  'CU 편의점에서 네이버페이 결제 시 20% 할인',
  (select id from payment_providers where code = 'NAVERPAY'),
  (select id from categories where slug = 'convenience'),
  (select id from brands where slug = 'cu'),
  '20% 즉시 할인 (최대 3,000원)',
  '네이버페이 바코드 결제
5,000원 이상 결제
일 1회
담배/상품권 제외',
  3000, false,
  '2026-03-05', '2026-03-20',
  false, true,
  'https://new-m.pay.naver.com/benefits',
  'official', true, 'published', 1, now()
),

-- 8. 네이버페이 홈플러스 7,000원 할인 (마트)
(
  'naverpay-homeplus-7000-202603',
  '네이버페이 홈플러스 7,000원 할인',
  '홈플러스에서 네이버페이 결제 시 7,000원 할인',
  (select id from payment_providers where code = 'NAVERPAY'),
  (select id from categories where slug = 'mart'),
  (select id from brands where slug = 'homeplus'),
  '7,000원 즉시 할인',
  '네이버페이 결제 시
50,000원 이상 결제
온/오프라인 동일 적용
월 2회',
  7000, false,
  '2026-03-03', '2026-04-10',
  true, true,
  'https://new-m.pay.naver.com/benefits',
  'official', true, 'published', 2, now()
),

-- ─────────────────────────────────────────────
-- 토스페이 8건
-- ─────────────────────────────────────────────

-- 9. 토스페이 배달의민족 5,000원 할인 (배달, priority 5)
(
  'tosspay-baemin-5000-202603',
  '토스페이 배달의민족 5,000원 할인',
  '배달의민족에서 토스페이 결제 시 5,000원 즉시 할인',
  (select id from payment_providers where code = 'TOSSPAY'),
  (select id from categories where slug = 'delivery'),
  (select id from brands where slug = 'baemin'),
  '5,000원 즉시 할인',
  '토스페이 결제 시
20,000원 이상 주문
월 1회 사용 가능
B마트 주문 제외',
  5000, false,
  '2026-03-01', '2026-04-15',
  true, false,
  'https://toss.im/pay/event',
  'official', true, 'published', 5, now()
),

-- 10. 토스페이 요기요 3,000원 할인 (배달)
(
  'tosspay-yogiyo-3000-202603',
  '토스페이 요기요 3,000원 할인',
  '요기요에서 토스페이 결제 시 3,000원 즉시 할인',
  (select id from payment_providers where code = 'TOSSPAY'),
  (select id from categories where slug = 'delivery'),
  (select id from brands where slug = 'yogiyo'),
  '3,000원 즉시 할인',
  '토스페이 결제 시
15,000원 이상 주문
월 2회',
  3000, false,
  '2026-03-05', '2026-03-31',
  true, false,
  'https://toss.im/pay/event',
  'official', true, 'published', 1, now()
),

-- 11. 토스페이 스타벅스 15% 할인 (카페, D-1 종료임박 critical)
(
  'tosspay-starbucks-15pct-202603',
  '토스페이 스타벅스 15% 할인',
  '스타벅스에서 토스페이 결제 시 15% 할인, 최대 3천원',
  (select id from payment_providers where code = 'TOSSPAY'),
  (select id from categories where slug = 'cafe'),
  (select id from brands where slug = 'starbucks'),
  '15% 즉시 할인 (최대 3,000원)',
  '토스페이 현장결제 시
5,000원 이상 결제
일 1회
드라이브스루 제외',
  3000, false,
  '2026-03-01', '2026-03-08',
  false, true,
  'https://toss.im/pay/event',
  'official', true, 'published', 3, now()
),

-- 12. 토스페이 메가커피 1,500원 할인 (카페)
(
  'tosspay-megacoffee-1500-202603',
  '토스페이 메가커피 1,500원 할인',
  '메가커피에서 토스페이 결제 시 1,500원 할인',
  (select id from payment_providers where code = 'TOSSPAY'),
  (select id from categories where slug = 'cafe'),
  (select id from brands where slug = 'megacoffee'),
  '1,500원 즉시 할인',
  '토스페이 현장결제
4,000원 이상 결제
월 3회',
  1500, false,
  '2026-03-01', '2026-04-20',
  false, true,
  'https://toss.im/pay/event',
  'official', true, 'published', 1, now()
),

-- 13. 토스페이 쿠팡 10% 할인 (쇼핑, priority 4)
(
  'tosspay-coupang-10pct-202603',
  '토스페이 쿠팡 10% 할인',
  '쿠팡에서 토스페이 결제 시 10% 할인',
  (select id from payment_providers where code = 'TOSSPAY'),
  (select id from categories where slug = 'shopping'),
  (select id from brands where slug = 'coupang'),
  '10% 즉시 할인 (최대 7,000원)',
  '토스페이 결제 시
30,000원 이상 주문
로켓배송 상품 한정
월 1회',
  7000, false,
  '2026-03-01', '2026-04-30',
  true, false,
  'https://toss.im/pay/event',
  'official', true, 'published', 4, now()
),

-- 14. 토스페이 무신사 7% 할인 (쇼핑, 이미 만료됨!)
(
  'tosspay-musinsa-7pct-202603',
  '토스페이 무신사 7% 할인',
  '무신사에서 토스페이 결제 시 7% 할인 (종료)',
  (select id from payment_providers where code = 'TOSSPAY'),
  (select id from categories where slug = 'shopping'),
  (select id from brands where slug = 'musinsa'),
  '7% 즉시 할인 (최대 5,000원)',
  '토스페이 결제 시
20,000원 이상
월 1회',
  5000, false,
  '2026-02-15', '2026-03-05',
  true, false,
  'https://toss.im/pay/event',
  'official', true, 'published', 0, now()
),

-- 15. 토스페이 올리브영 20% 할인 (뷰티)
(
  'tosspay-oliveyoung-20pct-202603',
  '토스페이 올리브영 20% 할인',
  '올리브영에서 토스페이 결제 시 20% 할인',
  (select id from payment_providers where code = 'TOSSPAY'),
  (select id from categories where slug = 'beauty'),
  (select id from brands where slug = 'oliveyoung'),
  '20% 즉시 할인 (최대 8,000원)',
  '토스페이 결제 시
온라인몰/오프라인 매장 모두
30,000원 이상 결제
월 1회',
  8000, false,
  '2026-03-01', '2026-04-15',
  true, true,
  'https://toss.im/pay/event',
  'official', true, 'published', 2, now()
),

-- 16. 토스페이 카카오T 30% 할인 (교통)
(
  'tosspay-kakaot-30pct-202603',
  '토스페이 카카오T 30% 할인',
  '카카오T 택시에서 토스페이 결제 시 30% 할인',
  (select id from payment_providers where code = 'TOSSPAY'),
  (select id from categories where slug = 'transport'),
  (select id from brands where slug = 'kakaot'),
  '30% 즉시 할인 (최대 5,000원)',
  '카카오T 택시 호출
토스페이 결제 시
일반호출만 해당
월 3회',
  5000, false,
  '2026-03-01', '2026-03-31',
  true, false,
  'https://toss.im/pay/event',
  'official', true, 'published', 2, now()
),

-- ─────────────────────────────────────────────
-- 카카오페이 8건
-- ─────────────────────────────────────────────

-- 17. 카카오페이 배달의민족 15% 할인 (배달, priority 4)
(
  'kakaopay-baemin-15pct-202603',
  '카카오페이 배달의민족 15% 할인',
  '배달의민족에서 카카오페이 결제 시 15% 즉시 할인',
  (select id from payment_providers where code = 'KAKAOPAY'),
  (select id from categories where slug = 'delivery'),
  (select id from brands where slug = 'baemin'),
  '15% 즉시 할인 (최대 5,000원)',
  '카카오페이 결제 시
15,000원 이상 주문
월 2회
배민1 주문 제외',
  5000, false,
  '2026-03-01', '2026-04-10',
  true, false,
  'https://www.kakaopay.com/pages/benefits',
  'official', true, 'published', 4, now()
),

-- 18. 카카오페이 쿠팡이츠 4,000원 할인 (배달)
(
  'kakaopay-coupangeats-4000-202603',
  '카카오페이 쿠팡이츠 4,000원 할인',
  '쿠팡이츠에서 카카오페이 결제 시 4,000원 할인',
  (select id from payment_providers where code = 'KAKAOPAY'),
  (select id from categories where slug = 'delivery'),
  (select id from brands where slug = 'coupangeats'),
  '4,000원 즉시 할인',
  '카카오페이 결제 시
18,000원 이상 주문
월 2회',
  4000, false,
  '2026-03-03', '2026-03-25',
  true, false,
  'https://www.kakaopay.com/pages/benefits',
  'official', true, 'published', 2, now()
),

-- 19. 카카오페이 스타벅스 20% 할인 (카페, D-0 오늘 종료!)
(
  'kakaopay-starbucks-20pct-202603',
  '카카오페이 스타벅스 20% 할인',
  '스타벅스에서 카카오페이 결제 시 20% 할인 - 오늘 마지막!',
  (select id from payment_providers where code = 'KAKAOPAY'),
  (select id from categories where slug = 'cafe'),
  (select id from brands where slug = 'starbucks'),
  '20% 즉시 할인 (최대 4,000원)',
  '카카오페이 현장결제 시
5,000원 이상 결제
일 1회',
  4000, false,
  '2026-03-01', '2026-03-07',
  false, true,
  'https://www.kakaopay.com/pages/benefits',
  'official', true, 'published', 3, now()
),

-- 20. 카카오페이 파리바게뜨 3,000원 할인 (카페)
(
  'kakaopay-parisbaguette-3000-202603',
  '카카오페이 파리바게뜨 3,000원 할인',
  '파리바게뜨에서 카카오페이 결제 시 3,000원 할인',
  (select id from payment_providers where code = 'KAKAOPAY'),
  (select id from categories where slug = 'cafe'),
  (select id from brands where slug = 'parisbaguette'),
  '3,000원 즉시 할인',
  '카카오페이 현장결제
10,000원 이상 결제
월 2회',
  3000, false,
  '2026-03-05', '2026-04-20',
  false, true,
  'https://www.kakaopay.com/pages/benefits',
  'official', true, 'published', 1, now()
),

-- 21. 카카오페이 쿠팡 5,000원 할인 (쇼핑, priority 5)
(
  'kakaopay-coupang-5000-202603',
  '카카오페이 쿠팡 5,000원 할인',
  '쿠팡에서 카카오페이 결제 시 5,000원 즉시 할인',
  (select id from payment_providers where code = 'KAKAOPAY'),
  (select id from categories where slug = 'shopping'),
  (select id from brands where slug = 'coupang'),
  '5,000원 즉시 할인',
  '카카오페이 결제 시
30,000원 이상 주문
로켓배송 상품 한정
월 2회',
  5000, false,
  '2026-03-01', '2026-04-15',
  true, false,
  'https://www.kakaopay.com/pages/benefits',
  'official', true, 'published', 5, now()
),

-- 22. 카카오페이 다이소 15% 할인 (쇼핑)
(
  'kakaopay-daiso-15pct-202603',
  '카카오페이 다이소 15% 할인',
  '다이소에서 카카오페이 결제 시 15% 할인',
  (select id from payment_providers where code = 'KAKAOPAY'),
  (select id from categories where slug = 'shopping'),
  (select id from brands where slug = 'daiso'),
  '15% 즉시 할인 (최대 2,000원)',
  '카카오페이 바코드 결제
5,000원 이상 결제
일 1회',
  2000, false,
  '2026-03-01', '2026-03-31',
  false, true,
  'https://www.kakaopay.com/pages/benefits',
  'official', true, 'published', 2, now()
),

-- 23. 카카오페이 CU 10% 할인 (편의점)
(
  'kakaopay-cu-10pct-202603',
  '카카오페이 CU 10% 할인',
  'CU 편의점에서 카카오페이 결제 시 10% 할인',
  (select id from payment_providers where code = 'KAKAOPAY'),
  (select id from categories where slug = 'convenience'),
  (select id from brands where slug = 'cu'),
  '10% 즉시 할인 (최대 2,000원)',
  '카카오페이 바코드 결제
3,000원 이상 결제
일 1회
담배/상품권 제외',
  2000, false,
  '2026-03-01', '2026-04-05',
  false, true,
  'https://www.kakaopay.com/pages/benefits',
  'official', true, 'published', 1, now()
),

-- 24. 카카오페이 홈플러스 10,000원 할인 (마트, priority 3)
(
  'kakaopay-homeplus-10000-202603',
  '카카오페이 홈플러스 10,000원 할인',
  '홈플러스에서 카카오페이 결제 시 10,000원 할인',
  (select id from payment_providers where code = 'KAKAOPAY'),
  (select id from categories where slug = 'mart'),
  (select id from brands where slug = 'homeplus'),
  '10,000원 즉시 할인',
  '카카오페이 결제 시
70,000원 이상 결제
온/오프라인 동일
월 1회',
  10000, false,
  '2026-03-01', '2026-04-30',
  true, true,
  'https://www.kakaopay.com/pages/benefits',
  'official', true, 'published', 3, now()
),

-- ─────────────────────────────────────────────
-- 페이코 6건
-- ─────────────────────────────────────────────

-- 25. 페이코 배달의민족 2,000원 할인 (배달)
(
  'payco-baemin-2000-202603',
  '페이코 배달의민족 2,000원 할인',
  '배달의민족에서 페이코 결제 시 2,000원 할인',
  (select id from payment_providers where code = 'PAYCO'),
  (select id from categories where slug = 'delivery'),
  (select id from brands where slug = 'baemin'),
  '2,000원 즉시 할인',
  '페이코 결제 시
12,000원 이상 주문
월 3회',
  2000, false,
  '2026-03-01', '2026-03-31',
  true, false,
  'https://www.payco.com/benefit/eventList.nhn',
  'official', true, 'published', 1, now()
),

-- 26. 페이코 버거킹 30% 할인 (배달, priority 3)
(
  'payco-burgerking-30pct-202603',
  '페이코 버거킹 30% 할인',
  '버거킹에서 페이코 결제 시 30% 할인',
  (select id from payment_providers where code = 'PAYCO'),
  (select id from categories where slug = 'delivery'),
  (select id from brands where slug = 'burgerking'),
  '30% 즉시 할인 (최대 5,000원)',
  '페이코 결제 시
버거킹 앱/딜리버리 주문
10,000원 이상
월 2회',
  5000, false,
  '2026-03-05', '2026-04-10',
  true, true,
  'https://www.payco.com/benefit/eventList.nhn',
  'official', true, 'published', 3, now()
),

-- 27. 페이코 쿠팡 8% 할인 (쇼핑)
(
  'payco-coupang-8pct-202603',
  '페이코 쿠팡 8% 할인',
  '쿠팡에서 페이코 결제 시 8% 할인',
  (select id from payment_providers where code = 'PAYCO'),
  (select id from categories where slug = 'shopping'),
  (select id from brands where slug = 'coupang'),
  '8% 즉시 할인 (최대 5,000원)',
  '페이코 결제 시
20,000원 이상 주문
로켓배송 한정
월 1회',
  5000, false,
  '2026-03-10', '2026-04-25',
  true, false,
  'https://www.payco.com/benefit/eventList.nhn',
  'official', true, 'published', 2, now()
),

-- 28. 페이코 무신사 5,000원 할인 (쇼핑, 이미 만료됨!)
(
  'payco-musinsa-5000-202603',
  '페이코 무신사 5,000원 할인',
  '무신사에서 페이코 결제 시 5,000원 할인 (종료)',
  (select id from payment_providers where code = 'PAYCO'),
  (select id from categories where slug = 'shopping'),
  (select id from brands where slug = 'musinsa'),
  '5,000원 즉시 할인',
  '페이코 결제 시
30,000원 이상 주문
월 1회',
  5000, false,
  '2026-02-10', '2026-03-04',
  true, false,
  'https://www.payco.com/benefit/eventList.nhn',
  'official', true, 'published', 0, now()
),

-- 29. 페이코 GS25 20% 할인 (편의점)
(
  'payco-gs25-20pct-202603',
  '페이코 GS25 20% 할인',
  'GS25 편의점에서 페이코 결제 시 20% 할인',
  (select id from payment_providers where code = 'PAYCO'),
  (select id from categories where slug = 'convenience'),
  (select id from brands where slug = 'gs25'),
  '20% 즉시 할인 (최대 3,000원)',
  '페이코 바코드 결제
5,000원 이상 결제
일 1회
담배/상품권 제외',
  3000, false,
  '2026-03-01', '2026-04-15',
  false, true,
  'https://www.payco.com/benefit/eventList.nhn',
  'official', true, 'published', 1, now()
),

-- 30. 페이코 그린카 40% 할인 (교통)
(
  'payco-greencar-40pct-202603',
  '페이코 그린카 40% 할인',
  '그린카에서 페이코 결제 시 40% 할인',
  (select id from payment_providers where code = 'PAYCO'),
  (select id from categories where slug = 'transport'),
  (select id from brands where slug = 'greencar'),
  '40% 즉시 할인 (최대 15,000원)',
  '페이코 결제 시
그린카 앱에서 예약
첫 이용 고객 한정
기간 내 1회',
  15000, false,
  '2026-03-01', '2026-04-20',
  true, false,
  'https://www.payco.com/benefit/eventList.nhn',
  'official', true, 'published', 2, now()
)

on conflict (slug) do update set
  title               = excluded.title,
  summary             = excluded.summary,
  payment_provider_id = excluded.payment_provider_id,
  category_id         = excluded.category_id,
  brand_id            = excluded.brand_id,
  benefit_text        = excluded.benefit_text,
  condition_text      = excluded.condition_text,
  max_benefit_value   = excluded.max_benefit_value,
  stacking_possible   = excluded.stacking_possible,
  start_date          = excluded.start_date,
  end_date            = excluded.end_date,
  is_online           = excluded.is_online,
  is_offline          = excluded.is_offline,
  source_url          = excluded.source_url,
  is_verified         = excluded.is_verified,
  status              = excluded.status,
  priority            = excluded.priority,
  published_at        = excluded.published_at;
