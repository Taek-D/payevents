import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "PayEvents 개인정보처리방침",
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 py-8">
      <h1 className="text-2xl font-bold sm:text-3xl">개인정보처리방침</h1>
      <p className="text-sm text-muted-foreground">시행일: 2026년 3월 1일</p>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">1. 수집하는 개인정보 항목</h2>
        <p className="leading-relaxed text-muted-foreground">
          PayEvents는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.
        </p>
        <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
          <li>
            <strong>뉴스레터 구독</strong>: 이메일 주소
          </li>
          <li>
            <strong>이벤트 제보</strong>: 제보자 이름, 이메일 주소 (선택 항목)
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">2. 수집 목적</h2>
        <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
          <li>주간 뉴스레터 발송 (간편결제 이벤트 정보 안내)</li>
          <li>이벤트 제보 검수 결과 안내 (제보자 이메일 입력 시)</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">3. 보유 및 이용 기간</h2>
        <p className="leading-relaxed text-muted-foreground">
          수집된 개인정보는 수집 목적이 달성되거나 이용자가 삭제를 요청할 때까지
          보유합니다.
        </p>
        <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
          <li>뉴스레터 구독 정보: 수신 거부 시까지</li>
          <li>이벤트 제보 정보: 검수 완료 후 6개월</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">4. 개인정보의 제3자 제공</h2>
        <p className="leading-relaxed text-muted-foreground">
          PayEvents는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">5. 수신 거부 및 삭제 요청</h2>
        <p className="leading-relaxed text-muted-foreground">
          뉴스레터 수신 거부는 뉴스레터 하단의 &ldquo;수신거부&rdquo; 링크를
          클릭하거나{" "}
          <Link
            href="/newsletter/unsubscribe"
            className="text-primary underline"
          >
            수신거부 페이지
          </Link>
          를 통해 가능합니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">6. 개인정보 보호 책임자</h2>
        <p className="leading-relaxed text-muted-foreground">
          개인정보 관련 문의는 아래 연락처로 보내주세요.
        </p>
        <p className="text-muted-foreground">
          이메일: privacy@payevents.kr
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">7. 방침 변경</h2>
        <p className="leading-relaxed text-muted-foreground">
          이 개인정보처리방침은 법령 변경이나 서비스 변경에 따라 수정될 수
          있습니다. 변경 시 사이트 내 공지를 통해 안내합니다.
        </p>
      </section>
    </div>
  )
}
