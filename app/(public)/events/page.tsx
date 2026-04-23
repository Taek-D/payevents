import type { Metadata } from "next"
import { Suspense } from "react"
import { EventsContainer } from "./events-container"

export const metadata: Metadata = {
  title: "간편결제 이벤트 모아보기",
  description: "네이버페이·토스페이·카카오페이·페이코 이벤트를 한곳에서",
  openGraph: {
    title: "간편결제 이벤트 모아보기",
    description: "네이버페이·토스페이·카카오페이·페이코 이벤트를 한곳에서",
    type: "website",
    images: [{ url: "/api/og?title=간편결제+이벤트+모아보기", width: 1200, height: 630 }],
  },
}

export default function EventsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">이벤트</h1>
      <p className="mt-1 text-muted-foreground">간편결제 할인 이벤트를 한눈에 확인하세요</p>
      <div className="mt-6">
        <Suspense fallback={null}>
          <EventsContainer />
        </Suspense>
      </div>
    </div>
  )
}
