# PayEvents — 간편결제 이벤트 큐레이션 플랫폼

> "오늘 뭐 쓰면 이득일까?"
> 네이버페이, 토스페이, 카카오페이, 페이코 할인 이벤트를 한곳에서 확인하세요.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Taek-D/payevents)

**Live**: [payevents-three.vercel.app](https://payevents-three.vercel.app)

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 이벤트 탐색 | 결제사별 / 카테고리별 필터링, 키워드 검색, 인기순/최신순 정렬 |
| 종료 임박 알림 | D-day 배지로 마감 임박 이벤트를 한눈에 확인 |
| 이벤트 상세 | 혜택 조건, 최대 할인 금액, 원문 링크 제공 |
| 뉴스레터 | 매주 간편결제 혜택 요약을 이메일로 수신 |
| 이벤트 제보 | 링크만 있으면 누구나 이벤트 제보 가능 |
| 관리자 검수 | 제보된 이벤트를 검토 후 승인/반려 |

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| Frontend | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| OG Image | `@vercel/og` (Edge Runtime) |
| Deployment | Vercel |

## 로컬 개발

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

```bash
cp .env.example .env.local
```

`.env.local`에 아래 값들을 채워주세요.

| 변수 | 설명 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 공개 키 (anon) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 서비스 역할 키 (서버 전용) |
| `NEXT_PUBLIC_BASE_URL` | 배포 도메인 (예: `https://payevents.kr`) |
| `ADMIN_SECRET_KEY` | 관리자 API 인증 키 |
| `NEXT_PUBLIC_ADMIN_SECRET` | 관리자 클라이언트 인증 키 |

### 3. Supabase 설정

Supabase SQL Editor에서 순서대로 실행:

```
1. db/schema.sql           -- 테이블 생성
2. db/seed.sql             -- 결제사, 카테고리, 브랜드, 초기 이벤트
3. db/seed_additional.sql  -- 추가 이벤트 30건
4. db/seed_final.sql       -- 최종 이벤트 12건
```

### 4. 개발 서버 실행

```bash
npm run dev
```

`http://localhost:3000`에서 확인하세요.

## 스크립트

```bash
npm run dev        # 개발 서버
npm run build      # 프로덕션 빌드
npm run lint       # ESLint 검사
npm run typecheck  # TypeScript 타입 체크
```

## 프로젝트 구조

```
app/
  (public)/           홈, 이벤트, 뉴스레터, 제보, 소개, 개인정보처리방침
  (admin)/            관리자 대시보드, 이벤트/제보 관리
  api/                REST API 엔드포인트
components/           UI 컴포넌트 (EventCard, StatusBadge, NewsletterForm 등)
lib/
  supabase/           Supabase 클라이언트 (server, client, admin)
  utils/              유틸리티 (date, slug, money)
  constants/          상수 (categories, providers)
  validations/        Zod 스키마
db/                   SQL 스키마 + 시드 데이터
scripts/              데이터 시드 스크립트
docs/                 출시 준비 자료
```

## API 엔드포인트

### Public

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/events` | 이벤트 목록 (필터, 검색, 정렬, 페이지네이션) |
| GET | `/api/events/[id]` | 이벤트 상세 |
| GET | `/api/events/ending-soon` | 종료 임박 이벤트 |
| POST | `/api/newsletter/subscribe` | 뉴스레터 구독 |
| GET | `/api/newsletter/unsubscribe` | 수신 거부 |
| POST | `/api/submissions` | 이벤트 제보 |

### Admin (`x-admin-secret` 헤더 필요)

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/admin/submissions` | 제보 목록 |
| POST | `/api/admin/submissions/[id]/approve` | 제보 승인 |
| POST | `/api/admin/submissions/[id]/reject` | 제보 반려 |
| GET | `/api/admin/events` | 이벤트 관리 목록 |

## 배포

Vercel Dashboard에서 GitHub 리포를 연결하고 환경 변수를 설정한 후 배포하세요.

```bash
npx vercel --prod
```

## 라이선스

MIT
