# PayEvents — 간편결제 이벤트 큐레이션 플랫폼

> 오늘 뭐 쓰면 이득일까? 네이버페이, 토스페이, 카카오페이, 페이코 이벤트를 한곳에서 확인하세요.

## 소개

PayEvents는 간편결제 서비스의 할인/적립 이벤트를 한곳에서 모아볼 수 있는 혜택 정보 미디어 플랫폼입니다.

- 결제사별/카테고리별 이벤트 필터링
- 종료 임박 이벤트 알림
- 주간 뉴스레터 구독
- 이벤트 크라우드소싱 제보

## 기술 스택

- **Frontend**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## 로컬 개발

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example`을 복사하여 `.env.local`을 생성하고 값을 채워주세요.

```bash
cp .env.example .env.local
```

| 변수 | 설명 | 필수 |
|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | O |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 공개 키 (anon) | O |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 서비스 역할 키 (서버 전용) | O |
| `NEXT_PUBLIC_BASE_URL` | 배포 도메인 (예: `https://payevents.kr`) | O |
| `ADMIN_SECRET_KEY` | 관리자 API 인증 키 | O |
| `NEXT_PUBLIC_ADMIN_SECRET` | 관리자 클라이언트 인증 키 | O |

### 3. Supabase 설정

Supabase SQL Editor에서 순서대로 실행:

```
1. db/schema.sql     — 테이블 생성
2. db/seed.sql       — 기본 데이터 (결제사, 카테고리, 브랜드, 이벤트)
3. db/seed_additional.sql  — 추가 이벤트 30건
4. db/seed_final.sql       — 최종 이벤트 12건
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

## 배포

Vercel에서 원클릭 배포:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/user/payevents)

또는 CLI:

```bash
npx vercel --prod
```

Vercel Dashboard에서 환경 변수를 설정한 후 배포하세요.

## 프로젝트 구조

```
app/
  (public)/         홈, 이벤트, 뉴스레터, 제보, 소개
  (admin)/          관리자 대시보드, 이벤트/제보 관리
  api/              REST API 엔드포인트
components/         UI 컴포넌트
lib/                유틸리티, 상수, Supabase 클라이언트
db/                 스키마, 시드 데이터
```

## 라이선스

MIT
