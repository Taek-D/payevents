import type { Metadata } from "next"
import { SubmissionForm } from "@/components/SubmissionForm"

export const metadata: Metadata = {
  title: "이벤트 제보하기 — PayEvents",
  description:
    "알고 있는 간편결제 이벤트를 공유해 주세요. 링크만 있어도 괜찮아요!",
}

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-lg py-12 sm:py-16">
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
        이벤트 제보하기
      </h1>
      <p className="mt-3 text-muted-foreground">
        알고 있는 간편결제 이벤트를 공유해 주세요. 링크만 있어도 괜찮아요!
      </p>
      <div className="mt-8">
        <SubmissionForm />
      </div>
    </div>
  )
}
