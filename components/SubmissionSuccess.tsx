"use client"

import { PartyPopper } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type SubmissionSuccessProps = {
  onReset: () => void
}

export function SubmissionSuccess({ onReset }: SubmissionSuccessProps) {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <PartyPopper className="size-16 text-primary" />
      <h2 className="mt-6 text-xl font-bold">제보 감사해요!</h2>
      <p className="mt-2 text-muted-foreground">
        검토 후 2~3일 내 반영될 예정이에요
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/events">
          <Button variant="outline">이벤트 더 보기</Button>
        </Link>
        <Button onClick={onReset}>추가로 제보하기</Button>
      </div>
    </div>
  )
}
