"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Search } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import { NAV_LINKS } from "@/lib/constants/nav"

export function NavActions() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center gap-2">
      {/* Search — visible on all viewports (Pitfall 9: keep existing feature surface) */}
      <Button variant="ghost" size="icon" aria-label="검색">
        <Search className="h-5 w-5" />
      </Button>

      {/* Desktop-only CTA */}
      <Link
        href="/newsletter"
        className={`${buttonVariants({ size: "sm" })} hidden sm:inline-flex`}
      >
        뉴스레터 구독
      </Link>

      {/* Mobile-only hamburger → Sheet drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          className="sm:hidden"
          render={<Button variant="ghost" size="icon" aria-label="메뉴 열기" />}
        >
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent className="w-72">
          <SheetHeader>
            <SheetTitle>메뉴</SheetTitle>
          </SheetHeader>
          <nav className="mt-6 flex flex-col gap-1 px-4">
            {NAV_LINKS.map((link) => (
              <SheetClose
                key={link.href}
                render={
                  <Link
                    href={link.href}
                    className="rounded-md px-3 py-2 text-base font-medium hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                }
              />
            ))}
            <SheetClose
              render={
                <Link
                  href="/newsletter"
                  className={`mt-4 ${buttonVariants({ size: "default" })}`}
                >
                  뉴스레터 구독
                </Link>
              }
            />
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
