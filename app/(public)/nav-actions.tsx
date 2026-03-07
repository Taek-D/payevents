"use client"

import Link from "next/link"
import { Search } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"

export function NavActions() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" aria-label="검색">
        <Search className="h-5 w-5" />
      </Button>
      <Link href="/newsletter" className={buttonVariants({ size: "sm" })}>
        뉴스레터 구독
      </Link>
    </div>
  )
}
