import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500">
            PayEvents
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/home" className="text-sm font-medium hover:text-primary transition-colors">
              이벤트 모아보기
            </Link>
            <Link href="/home" tabIndex={-1}>
              <Button size="sm" className="hidden sm:inline-flex bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white rounded-full border-0">
                시작하기
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full flex flex-col items-center">
        {children}
      </main>
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-center text-sm text-muted-foreground">
          <Link href="/" className="text-xl font-bold text-foreground">
            PayEvents
          </Link>
          <p className="max-w-md">
            네이버페이, 토스페이, 카카오페이 등 다양한 간편결제 혜택을 한곳에서 모아보는 큐레이션 플랫폼입니다.
          </p>
          <div className="flex gap-6 mt-4">
            <Link href="/about" className="hover:text-foreground transition-colors">
              서비스 소개
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              개인정보처리방침
            </Link>
            <Link href="/submit" className="hover:text-foreground transition-colors">
              이벤트 제보
            </Link>
          </div>
          <p className="mt-4">&copy; {new Date().getFullYear()} PayEvents. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
