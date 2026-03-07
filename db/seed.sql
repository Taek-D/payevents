-- PayEvents Seed Data
-- schema.sql 실행 후 이 파일을 실행

-- ============================================================
-- 결제사 (4개)
-- ============================================================

insert into payment_providers (code, name_ko, sort_order) values
  ('NAVERPAY',  '네이버페이', 1),
  ('TOSSPAY',   '토스페이',   2),
  ('KAKAOPAY',  '카카오페이', 3),
  ('PAYCO',     '페이코',     4)
on conflict (code) do update set
  name_ko    = excluded.name_ko,
  sort_order = excluded.sort_order;

-- ============================================================
-- 카테고리 (7개)
-- ============================================================

insert into categories (slug, name_ko, sort_order) values
  ('delivery',    '배달/음식',  1),
  ('cafe',        '카페/디저트', 2),
  ('shopping',    '쇼핑',       3),
  ('convenience', '편의점',     4),
  ('mart',        '마트/생활',  5),
  ('beauty',      '뷰티/패션',  6),
  ('transport',   '교통/주유',  7)
on conflict (slug) do update set
  name_ko    = excluded.name_ko,
  sort_order = excluded.sort_order;

-- ============================================================
-- 브랜드 (12개)
-- ============================================================

insert into brands (slug, name_ko, normalized_name, website_url) values
  ('baemin',       '배달의민족', 'baemin',       'https://www.baemin.com'),
  ('coupangeats',  '쿠팡이츠',  'coupangeats',  'https://www.coupangeats.com'),
  ('starbucks',    '스타벅스',   'starbucks',    'https://www.starbucks.co.kr'),
  ('ediya',        '이디야',    'ediya',        'https://www.ediya.com'),
  ('oliveyoung',   '올리브영',   'oliveyoung',   'https://www.oliveyoung.co.kr'),
  ('cu',           'CU',        'cu',           'https://www.cu.co.kr'),
  ('gs25',         'GS25',      'gs25',         'https://gs25.gsretail.com'),
  ('emart',        '이마트',    'emart',        'https://www.emart.com'),
  ('lottemart',    '롯데마트',   'lottemart',    'https://www.lottemart.com'),
  ('socar',        '쏘카',      'socar',        'https://www.socar.kr'),
  ('yogiyo',       '요기요',    'yogiyo',       'https://www.yogiyo.co.kr'),
  ('megacoffee',   '메가커피',   'megacoffee',   'https://www.mega-mgccoffee.com')
on conflict (slug) do update set
  name_ko         = excluded.name_ko,
  normalized_name = excluded.normalized_name,
  website_url     = excluded.website_url;

-- ============================================================
-- 이벤트 (10건) — 실제로 존재할 법한 2026년 3월 이벤트
-- ============================================================

insert into events (
  slug, title, summary,
  payment_provider_id, category_id, brand_id,
  benefit_text, condition_text, max_benefit_value,
  stacking_possible, start_date, end_date,
  is_online, is_offline, source_url, source_type,
  is_verified, status, priority, published_at
) values
-- 1. 네이버페이 배달의민족 할인
(
  'naverpay-baemin-10pct-202603',
  '네이버페이 배달의민족 10% 할인',
  '배달의민족에서 네이버페이로 결제 시 10% 즉시 할인',
  (select id from payment_providers where code = 'NAVERPAY'),
  (select id from categories where slug = 'delivery'),
  (select id from brands where slug = 'baemin'),
  '10% 즉시 할인 (최대 3,000원)',
  '네이버페이 결제 시 / 1만원 이상 주문 / 월 2회',
  3000, false,
  '2026-03-01', '2026-03-31',
  true, false,
  'https://new-m.pay.naver.com/benefits',
  'official', true, 'published', 1, now()
),
-- 2. 네이버페이 스타벅스 적립
(
  'naverpay-starbucks-point-202603',
  '네이버페이 스타벅스 추가 적립',
  '스타벅스에서 네이버페이 결제 시 네이버포인트 추가 적립',
  (select id from payment_providers where code = 'NAVERPAY'),
  (select id from categories where slug = 'cafe'),
  (select id from brands where slug = 'starbucks'),
  '네이버포인트 5% 추가 적립',
  '네이버페이 현장결제 시 / 횟수 무제한',
  null, false,
  '2026-03-01', '2026-03-15',
  false, true,
  'https://new-m.pay.naver.com/benefits',
  'official', true, 'published', 0, now()
),
-- 3. 네이버페이 올리브영 할인
(
  'naverpay-oliveyoung-15pct-202603',
  '네이버페이 올리브영 15% 할인',
  '올리브영 온라인몰에서 네이버페이 결제 시 15% 할인',
  (select id from payment_providers where code = 'NAVERPAY'),
  (select id from categories where slug = 'beauty'),
  (select id from brands where slug = 'oliveyoung'),
  '15% 즉시 할인 (최대 5,000원)',
  '온라인몰 한정 / 2만원 이상 결제 / 월 1회',
  5000, false,
  '2026-03-05', '2026-03-25',
  true, false,
  'https://new-m.pay.naver.com/benefits',
  'official', true, 'published', 0, now()
),
-- 4. 토스페이 쿠팡이츠 할인
(
  'tosspay-coupangeats-3000-202603',
  '토스페이 쿠팡이츠 3,000원 할인',
  '쿠팡이츠에서 토스페이 결제 시 3,000원 즉시 할인',
  (select id from payment_providers where code = 'TOSSPAY'),
  (select id from categories where slug = 'delivery'),
  (select id from brands where slug = 'coupangeats'),
  '3,000원 즉시 할인',
  '토스페이 결제 시 / 15,000원 이상 주문 / 월 1회',
  3000, false,
  '2026-03-01', '2026-03-31',
  true, false,
  'https://toss.im/pay/event',
  'official', true, 'published', 1, now()
),
-- 5. 토스페이 CU 할인
(
  'tosspay-cu-10pct-202603',
  '토스페이 CU 10% 할인',
  'CU 편의점에서 토스페이 결제 시 10% 할인',
  (select id from payment_providers where code = 'TOSSPAY'),
  (select id from categories where slug = 'convenience'),
  (select id from brands where slug = 'cu'),
  '10% 즉시 할인 (최대 2,000원)',
  '토스페이 현장결제 / 5,000원 이상 / 일 1회',
  2000, false,
  '2026-03-01', '2026-03-31',
  false, true,
  'https://toss.im/pay/event',
  'official', true, 'published', 0, now()
),
-- 6. 토스페이 이마트 할인
(
  'tosspay-emart-5000-202603',
  '토스페이 이마트 5,000원 할인',
  '이마트에서 토스페이 결제 시 5,000원 할인',
  (select id from payment_providers where code = 'TOSSPAY'),
  (select id from categories where slug = 'mart'),
  (select id from brands where slug = 'emart'),
  '5,000원 즉시 할인',
  '토스페이 결제 / 3만원 이상 결제 / 월 2회',
  5000, false,
  '2026-03-10', '2026-03-31',
  false, true,
  'https://toss.im/pay/event',
  'official', true, 'published', 0, now()
),
-- 7. 카카오페이 요기요 할인
(
  'kakaopay-yogiyo-20pct-202603',
  '카카오페이 요기요 20% 할인',
  '요기요에서 카카오페이 결제 시 20% 할인',
  (select id from payment_providers where code = 'KAKAOPAY'),
  (select id from categories where slug = 'delivery'),
  (select id from brands where slug = 'yogiyo'),
  '20% 즉시 할인 (최대 4,000원)',
  '카카오페이 결제 시 / 12,000원 이상 / 월 2회',
  4000, false,
  '2026-03-01', '2026-03-31',
  true, false,
  'https://www.kakaopay.com/pages/benefits',
  'official', true, 'published', 1, now()
),
-- 8. 카카오페이 GS25 할인
(
  'kakaopay-gs25-15pct-202603',
  '카카오페이 GS25 15% 할인',
  'GS25 편의점에서 카카오페이 결제 시 15% 할인',
  (select id from payment_providers where code = 'KAKAOPAY'),
  (select id from categories where slug = 'convenience'),
  (select id from brands where slug = 'gs25'),
  '15% 즉시 할인 (최대 2,000원)',
  '카카오페이 바코드 결제 / 3,000원 이상 / 일 1회',
  2000, false,
  '2026-03-03', '2026-03-23',
  false, true,
  'https://www.kakaopay.com/pages/benefits',
  'official', true, 'published', 0, now()
),
-- 9. 카카오페이 메가커피 할인
(
  'kakaopay-megacoffee-2000-202603',
  '카카오페이 메가커피 2,000원 할인',
  '메가커피에서 카카오페이 결제 시 2,000원 할인',
  (select id from payment_providers where code = 'KAKAOPAY'),
  (select id from categories where slug = 'cafe'),
  (select id from brands where slug = 'megacoffee'),
  '2,000원 즉시 할인',
  '카카오페이 결제 / 5,000원 이상 / 월 1회',
  2000, false,
  '2026-03-01', '2026-03-15',
  false, true,
  'https://www.kakaopay.com/pages/benefits',
  'official', true, 'published', 0, now()
),
-- 10. 페이코 쏘카 할인
(
  'payco-socar-30pct-202603',
  '페이코 쏘카 30% 할인',
  '쏘카에서 페이코 결제 시 30% 할인',
  (select id from payment_providers where code = 'PAYCO'),
  (select id from categories where slug = 'transport'),
  (select id from brands where slug = 'socar'),
  '30% 즉시 할인 (최대 10,000원)',
  '페이코 결제 / 첫 이용 고객 한정 / 기간 내 1회',
  10000, false,
  '2026-03-01', '2026-03-31',
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
  start_date          = excluded.start_date,
  end_date            = excluded.end_date,
  is_online           = excluded.is_online,
  is_offline          = excluded.is_offline,
  source_url          = excluded.source_url,
  is_verified         = excluded.is_verified,
  status              = excluded.status,
  priority            = excluded.priority,
  published_at        = excluded.published_at;
