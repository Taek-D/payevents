import type { Metadata } from "next"
import { Mail, Target, BellOff } from "lucide-react"
import { NewsletterForm } from "@/components/NewsletterForm"

export const metadata: Metadata = {
  title: "뉴스레터 구독 — PayEvents",
  description:
    "매주 월요일, 놓치면 아까운 간편결제 이벤트를 정리해서 보내드려요.",
}

const BENEFITS = [
  { icon: Mail, text: "매주 1회 발송", emoji: "📬" },
  { icon: Target, text: "핵심만 골라 정리", emoji: "🎯" },
  { icon: BellOff, text: "언제든지 수신 거부 가능", emoji: "🔕" },
]

export default function NewsletterPage() {
  return (
    <div className="mx-auto max-w-lg py-12 text-center sm:py-16">
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
        매주 간편결제 혜택 정리, 메일로 받기
      </h1>
      <p className="mt-3 text-muted-foreground">
        매주 월요일, 이번 주 놓치면 아까운 간편결제 이벤트를 정리해서
        보내드려요.
      </p>

      <div className="mt-8 flex justify-center gap-6 sm:gap-8">
        {BENEFITS.map((b) => (
          <div key={b.text} className="flex flex-col items-center gap-1.5">
            <span className="text-2xl">{b.emoji}</span>
            <span className="text-sm font-medium">{b.text}</span>
          </div>
        ))}
      </div>

      <div className="mt-10 text-left">
        <NewsletterForm source="newsletter_page" variant="full" />
      </div>
    </div>
  )
}
