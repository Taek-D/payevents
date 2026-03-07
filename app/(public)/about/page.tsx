import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "소개",
  description: "PayEvents는 간편결제 할인 이벤트를 한곳에서 모아볼 수 있는 혜택 정보 플랫폼입니다.",
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-10 py-8">
      <section>
        <h1 className="text-2xl font-bold sm:text-3xl">PayEvents란?</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          네이버페이, 토스페이, 카카오페이, 페이코 등 간편결제 서비스에서 진행하는
          할인·적립 이벤트를 한곳에서 확인할 수 있는 혜택 정보 플랫폼입니다.
        </p>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          여러 결제 앱을 일일이 확인할 필요 없이, PayEvents에서 지금 쓸 수 있는
          이벤트를 빠르게 찾아보세요.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold">어떻게 이벤트를 수집하나요?</h2>
        <ul className="mt-4 space-y-3">
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              1
            </span>
            <div>
              <p className="font-medium">공식 채널 확인</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                각 결제사의 공식 이벤트 페이지와 앱 공지를 정기적으로 확인합니다.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              2
            </span>
            <div>
              <p className="font-medium">사용자 제보</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                사용자가 발견한 이벤트를 제보할 수 있으며, 운영팀이 검수 후 게시합니다.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              3
            </span>
            <div>
              <p className="font-medium">정보 검증</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                모든 이벤트는 원문 링크와 함께 게시되어, 정확한 조건을 직접 확인할 수 있습니다.
              </p>
            </div>
          </li>
        </ul>
      </section>

      <section className="rounded-xl border border-yellow-200 bg-yellow-50 px-5 py-4">
        <h2 className="font-bold text-yellow-800">면책 고지</h2>
        <p className="mt-2 text-sm leading-relaxed text-yellow-700">
          PayEvents에 게시된 이벤트 정보는 참고용입니다. 할인율, 조건, 기간 등은
          변경될 수 있으며, 정확한 내용은 각 결제사 공식 페이지에서 확인해 주세요.
          PayEvents는 금융 서비스가 아닌 혜택 정보 큐레이션 플랫폼입니다.
        </p>
      </section>

      <section className="text-center">
        <p className="text-muted-foreground">
          알고 있는 이벤트가 있으신가요?
        </p>
        <Link href="/submit" className="mt-3 inline-block">
          <Button size="lg" className="gap-2 font-semibold">
            이벤트 제보하기
          </Button>
        </Link>
      </section>
    </div>
  )
}
