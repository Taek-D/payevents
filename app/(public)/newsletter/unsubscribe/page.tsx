import type { Metadata } from "next"
import Link from "next/link"
import { MailX } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "수신 거부 — PayEvents",
}

export default function UnsubscribePage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center">
      <MailX className="size-16 text-muted-foreground/50" />
      <h1 className="mt-6 text-xl font-semibold">
        수신 거부가 완료되었어요
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        더 이상 뉴스레터를 받지 않습니다. 다시 구독하고 싶으시면 아래
        버튼을 눌러주세요.
      </p>
      <Link href="/newsletter" className="mt-6">
        <Button variant="outline">다시 구독하기</Button>
      </Link>
    </div>
  )
}
