import Link from "next/link"
import { SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EventNotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center">
      <SearchX className="size-16 text-muted-foreground/50" />
      <h2 className="mt-6 text-xl font-semibold">
        이벤트를 찾을 수 없어요
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        삭제되었거나 잘못된 주소일 수 있어요.
      </p>
      <Link href="/events" className="mt-6">
        <Button variant="outline">이벤트 목록으로 돌아가기</Button>
      </Link>
    </div>
  )
}
