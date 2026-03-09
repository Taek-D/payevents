import Link from "next/link"
import { NavActions } from "./nav-actions"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/home" className="text-xl font-bold">
            PayEvents
          </Link>
          <NavActions />
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">{children}</div>
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto flex flex-col items-center gap-2 px-4 text-center text-sm text-muted-foreground">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link href="/" className="hover:text-foreground">
              서비스 소개
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              개인정보처리방침
            </Link>
            <Link href="/submit" className="hover:text-foreground">
              이벤트 제보
            </Link>
            <Link href="/admin" className="hover:text-foreground">
              관리자
            </Link>
          </div>
          <p>&copy; 2026 PayEvents. 혜택 정보 미디어 플랫폼.</p>
        </div>
      </footer>
    </div>
  )
}
