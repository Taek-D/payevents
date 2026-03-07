-- PayEvents 최종 시드 데이터 (Day 14)
-- seed.sql + seed_additional.sql 실행 후 이 파일을 실행
-- 비어있는 결제사/카테고리 조합 채우기 (12건)
-- 오늘 기준: 2026-03-07

-- ============================================================
-- 추가 브랜드
-- ============================================================

insert into brands (slug, name_ko, normalized_name, website_url) values
  ('aritaum',  '아리따움',   'aritaum',  'https://www.aritaum.com'),
  ('socar',    '쏘카',       'socar',    'https://www.socar.kr'),
  ('emart',    '이마트',     'emart',    'https://www.emart.com'),
  ('lotteria', '롯데리아',   'lotteria', 'https://www.lotteria.com')
on conflict (slug) do update set
  name_ko         = excluded.name_ko,
  normalized_name = excluded.normalized_name,
  website_url     = excluded.website_url;

-- ============================================================
-- 이벤트 12건 (빈 조합 채우기)
-- ============================================================

-- 네이버페이 + 뷰티
insert into events (slug, title, summary, payment_provider_id, category_id, brand_id,
  benefit_text, condition_text, max_benefit_value, stacking_possible,
  start_date, end_date, is_online, is_offline, source_url, source_type,
  is_verified, status, priority, published_at)
select
  'naverpay-innisfree-15pct-202603',
  '네이버페이 이니스프리 15% 할인',
  '이니스프리 온라인몰에서 네이버페이 결제 시 15% 할인',
  pp.id, cat.id, br.id,
  '15% 즉시 할인 (최대 5,000원)',
  '네이버페이 결제 시\n20,000원 이상 결제\n월 2회',
  5000, false,
  '2026-03-05', '2026-04-15', true, false,
  'https://new-m.pay.naver.com/benefits', 'official',
  true, 'published', 2, now()
from payment_providers pp, categories cat, brands br
where pp.code = 'NAVERPAY' and cat.slug = 'beauty' and br.slug = 'innisfree'
on conflict (slug) do nothing;

-- 네이버페이 + 교통
insert into events (slug, title, summary, payment_provider_id, category_id, brand_id,
  benefit_text, condition_text, max_benefit_value, stacking_possible,
  start_date, end_date, is_online, is_offline, source_url, source_type,
  is_verified, status, priority, published_at)
select
  'naverpay-socar-25pct-202603',
  '네이버페이 쏘카 25% 할인',
  '쏘카 앱에서 네이버페이 결제 시 25% 할인',
  pp.id, cat.id, br.id,
  '25% 즉시 할인 (최대 10,000원)',
  '네이버페이 결제 시\n쏘카 앱에서 예약\n50,000원 이상 이용\n월 1회',
  10000, false,
  '2026-03-01', '2026-03-31', true, false,
  'https://new-m.pay.naver.com/benefits', 'official',
  true, 'published', 3, now()
from payment_providers pp, categories cat, brands br
where pp.code = 'NAVERPAY' and cat.slug = 'transport' and br.slug = 'socar'
on conflict (slug) do nothing;

-- 토스페이 + 편의점
insert into events (slug, title, summary, payment_provider_id, category_id, brand_id,
  benefit_text, condition_text, max_benefit_value, stacking_possible,
  start_date, end_date, is_online, is_offline, source_url, source_type,
  is_verified, status, priority, published_at)
select
  'tosspay-gs25-15pct-202603',
  '토스페이 GS25 15% 할인',
  'GS25 편의점에서 토스페이 결제 시 15% 할인',
  pp.id, cat.id, br.id,
  '15% 즉시 할인 (최대 2,500원)',
  '토스페이 현장결제\n5,000원 이상 결제\n일 1회\n담배/상품권 제외',
  2500, false,
  '2026-03-03', '2026-04-10', false, true,
  'https://toss.im/pay/event', 'official',
  true, 'published', 2, now()
from payment_providers pp, categories cat, brands br
where pp.code = 'TOSSPAY' and cat.slug = 'convenience' and br.slug = 'gs25'
on conflict (slug) do nothing;

-- 토스페이 + 마트
insert into events (slug, title, summary, payment_provider_id, category_id, brand_id,
  benefit_text, condition_text, max_benefit_value, stacking_possible,
  start_date, end_date, is_online, is_offline, source_url, source_type,
  is_verified, status, priority, published_at)
select
  'tosspay-emart-8000-202603',
  '토스페이 이마트 8,000원 할인',
  '이마트에서 토스페이 결제 시 8,000원 할인',
  pp.id, cat.id, br.id,
  '8,000원 즉시 할인',
  '토스페이 결제 시\n50,000원 이상 결제\n온/오프라인 동일\n월 2회',
  8000, false,
  '2026-03-01', '2026-04-20', true, true,
  'https://toss.im/pay/event', 'official',
  true, 'published', 3, now()
from payment_providers pp, categories cat, brands br
where pp.code = 'TOSSPAY' and cat.slug = 'mart' and br.slug = 'emart'
on conflict (slug) do nothing;

-- 카카오페이 + 뷰티
insert into events (slug, title, summary, payment_provider_id, category_id, brand_id,
  benefit_text, condition_text, max_benefit_value, stacking_possible,
  start_date, end_date, is_online, is_offline, source_url, source_type,
  is_verified, status, priority, published_at)
select
  'kakaopay-aritaum-20pct-202603',
  '카카오페이 아리따움 20% 할인',
  '아리따움에서 카카오페이 결제 시 20% 할인',
  pp.id, cat.id, br.id,
  '20% 즉시 할인 (최대 6,000원)',
  '카카오페이 결제 시\n온/오프라인 모두\n20,000원 이상 결제\n월 2회',
  6000, false,
  '2026-03-05', '2026-04-25', true, true,
  'https://www.kakaopay.com/pages/benefits', 'official',
  true, 'published', 2, now()
from payment_providers pp, categories cat, brands br
where pp.code = 'KAKAOPAY' and cat.slug = 'beauty' and br.slug = 'aritaum'
on conflict (slug) do nothing;

-- 카카오페이 + 교통
insert into events (slug, title, summary, payment_provider_id, category_id, brand_id,
  benefit_text, condition_text, max_benefit_value, stacking_possible,
  start_date, end_date, is_online, is_offline, source_url, source_type,
  is_verified, status, priority, published_at)
select
  'kakaopay-socar-30pct-202603',
  '카카오페이 쏘카 30% 할인',
  '쏘카에서 카카오페이 결제 시 30% 할인',
  pp.id, cat.id, br.id,
  '30% 즉시 할인 (최대 12,000원)',
  '카카오페이 결제 시\n쏘카 앱 예약\n40,000원 이상 이용\n월 1회',
  12000, false,
  '2026-03-01', '2026-04-15', true, false,
  'https://www.kakaopay.com/pages/benefits', 'official',
  true, 'published', 4, now()
from payment_providers pp, categories cat, brands br
where pp.code = 'KAKAOPAY' and cat.slug = 'transport' and br.slug = 'socar'
on conflict (slug) do nothing;

-- 페이코 + 카페
insert into events (slug, title, summary, payment_provider_id, category_id, brand_id,
  benefit_text, condition_text, max_benefit_value, stacking_possible,
  start_date, end_date, is_online, is_offline, source_url, source_type,
  is_verified, status, priority, published_at)
select
  'payco-twosome-2000-202603',
  '페이코 투썸플레이스 2,000원 할인',
  '투썸플레이스에서 페이코 결제 시 2,000원 할인',
  pp.id, cat.id, br.id,
  '2,000원 즉시 할인',
  '페이코 현장결제\n7,000원 이상 결제\n월 3회',
  2000, false,
  '2026-03-05', '2026-04-20', false, true,
  'https://www.payco.com/benefit/eventList.nhn', 'official',
  true, 'published', 1, now()
from payment_providers pp, categories cat, brands br
where pp.code = 'PAYCO' and cat.slug = 'cafe' and br.slug = 'twosome'
on conflict (slug) do nothing;

-- 페이코 + 마트
insert into events (slug, title, summary, payment_provider_id, category_id, brand_id,
  benefit_text, condition_text, max_benefit_value, stacking_possible,
  start_date, end_date, is_online, is_offline, source_url, source_type,
  is_verified, status, priority, published_at)
select
  'payco-homeplus-5000-202603',
  '페이코 홈플러스 5,000원 할인',
  '홈플러스에서 페이코 결제 시 5,000원 할인',
  pp.id, cat.id, br.id,
  '5,000원 즉시 할인',
  '페이코 결제 시\n40,000원 이상 결제\n온/오프라인 동일\n월 2회',
  5000, false,
  '2026-03-01', '2026-04-10', true, true,
  'https://www.payco.com/benefit/eventList.nhn', 'official',
  true, 'published', 2, now()
from payment_providers pp, categories cat, brands br
where pp.code = 'PAYCO' and cat.slug = 'mart' and br.slug = 'homeplus'
on conflict (slug) do nothing;

-- 페이코 + 뷰티
insert into events (slug, title, summary, payment_provider_id, category_id, brand_id,
  benefit_text, condition_text, max_benefit_value, stacking_possible,
  start_date, end_date, is_online, is_offline, source_url, source_type,
  is_verified, status, priority, published_at)
select
  'payco-oliveyoung-15pct-202603',
  '페이코 올리브영 15% 할인',
  '올리브영에서 페이코 결제 시 15% 할인',
  pp.id, cat.id, br.id,
  '15% 즉시 할인 (최대 5,000원)',
  '페이코 결제 시\n온라인/오프라인 모두\n20,000원 이상 결제\n월 1회',
  5000, false,
  '2026-03-03', '2026-04-15', true, true,
  'https://www.payco.com/benefit/eventList.nhn', 'official',
  true, 'published', 3, now()
from payment_providers pp, categories cat, brands br
where pp.code = 'PAYCO' and cat.slug = 'beauty' and br.slug = 'oliveyoung'
on conflict (slug) do nothing;

-- 추가 인기 이벤트 3건 (priority 높게)

-- 토스페이 + 뷰티 (이니스프리)
insert into events (slug, title, summary, payment_provider_id, category_id, brand_id,
  benefit_text, condition_text, max_benefit_value, stacking_possible,
  start_date, end_date, is_online, is_offline, source_url, source_type,
  is_verified, status, priority, published_at)
select
  'tosspay-innisfree-25pct-202603',
  '토스페이 이니스프리 25% 할인',
  '이니스프리 온라인에서 토스페이 결제 시 25% 할인',
  pp.id, cat.id, br.id,
  '25% 즉시 할인 (최대 8,000원)',
  '토스페이 결제 시\n온라인몰 한정\n25,000원 이상 결제\n월 1회',
  8000, false,
  '2026-03-10', '2026-04-30', true, false,
  'https://toss.im/pay/event', 'official',
  true, 'published', 4, now()
from payment_providers pp, categories cat, brands br
where pp.code = 'TOSSPAY' and cat.slug = 'beauty' and br.slug = 'innisfree'
on conflict (slug) do nothing;

-- 네이버페이 + 마트 (이마트)
insert into events (slug, title, summary, payment_provider_id, category_id, brand_id,
  benefit_text, condition_text, max_benefit_value, stacking_possible,
  start_date, end_date, is_online, is_offline, source_url, source_type,
  is_verified, status, priority, published_at)
select
  'naverpay-emart-10000-202603',
  '네이버페이 이마트 10,000원 할인',
  '이마트에서 네이버페이 결제 시 10,000원 할인',
  pp.id, cat.id, br.id,
  '10,000원 즉시 할인',
  '네이버페이 결제 시\n60,000원 이상 결제\n온/오프라인 동일\n월 1회',
  10000, false,
  '2026-03-01', '2026-03-31', true, true,
  'https://new-m.pay.naver.com/benefits', 'official',
  true, 'published', 5, now()
from payment_providers pp, categories cat, brands br
where pp.code = 'NAVERPAY' and cat.slug = 'mart' and br.slug = 'emart'
on conflict (slug) do nothing;

-- 카카오페이 + 편의점 (GS25)
insert into events (slug, title, summary, payment_provider_id, category_id, brand_id,
  benefit_text, condition_text, max_benefit_value, stacking_possible,
  start_date, end_date, is_online, is_offline, source_url, source_type,
  is_verified, status, priority, published_at)
select
  'kakaopay-gs25-15pct-202603',
  '카카오페이 GS25 15% 할인',
  'GS25에서 카카오페이 결제 시 15% 할인',
  pp.id, cat.id, br.id,
  '15% 즉시 할인 (최대 2,000원)',
  '카카오페이 바코드 결제\n5,000원 이상 결제\n일 1회\n담배/상품권 제외',
  2000, false,
  '2026-03-01', '2026-04-05', false, true,
  'https://www.kakaopay.com/pages/benefits', 'official',
  true, 'published', 1, now()
from payment_providers pp, categories cat, brands br
where pp.code = 'KAKAOPAY' and cat.slug = 'convenience' and br.slug = 'gs25'
on conflict (slug) do nothing;
