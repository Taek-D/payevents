import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Search, Zap, Bell, CheckCircle2 } from "lucide-react"

export const metadata = {
    title: "PayEvents — 오늘 뭐 쓰면 이득일까?",
    description: "네이버페이, 토스페이, 카카오페이 등 간편결제 할인 이벤트를 한곳에서 확인하세요.",
}

export default function MarketingPage() {
    return (
        <div className="w-full flex flex-col items-center">
            {/* Hero Section */}
            <section className="w-full max-w-6xl px-4 py-24 sm:py-32 flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-tight transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    🎉 간편결제 혜택 모아보기 서비스 오픈
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl">
                    <span className="block text-muted-foreground text-2xl sm:text-3xl mb-4 font-semibold">오늘 결제할 때,</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500">
                        어떤 페이를 써야 가장 이득일까?
                    </span>
                </h1>

                <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                    네이버페이, 토스페이, 카카오페이 앱을 일일이 열어보지 마세요.
                    <br className="hidden sm:inline" />
                    현재 진행 중인 모든 간편결제 할인/적립 이벤트를 한 화면에서 비교해 드립니다.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-8">
                    <Link href="/home">
                        <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 border-0">
                            오늘의 이벤트 확인하기
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    <Link href="/newsletter">
                        <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                            주간 혜택 구독하기
                        </Button>
                    </Link>
                </div>

                {/* Mockup or Illustration Placeholder */}
                <div className="w-full max-w-4xl mt-16 p-2 rounded-2xl bg-gradient-to-b from-primary/10 to-background border shadow-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5" />
                    <div className="rounded-xl overflow-hidden border bg-background/50 backdrop-blur aspect-video flex flex-col items-center justify-center p-8 relative">
                        <div className="space-y-4 w-full max-w-md text-left">
                            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                            <div className="p-4 border rounded-xl bg-card shadow-sm space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">토스</div>
                                    <div className="space-y-1">
                                        <div className="h-4 w-32 bg-foreground/10 rounded" />
                                        <div className="h-3 w-48 bg-muted rounded" />
                                    </div>
                                </div>
                                <div className="h-12 w-full bg-gradient-to-r from-blue-500/10 to-transparent rounded-lg border border-blue-500/20 px-3 py-2 flex flex-col justify-center">
                                    <span className="text-xs text-blue-600 font-semibold mb-1">결제 혜택</span>
                                    <span className="text-sm font-bold">10% 즉시 할인 (최대 3,000원)</span>
                                </div>
                            </div>

                            <div className="p-4 border rounded-xl bg-card shadow-sm space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs">N페이</div>
                                    <div className="space-y-1">
                                        <div className="h-4 w-32 bg-foreground/10 rounded" />
                                        <div className="h-3 w-48 bg-muted rounded" />
                                    </div>
                                </div>
                                <div className="h-12 w-full bg-gradient-to-r from-green-500/10 to-transparent rounded-lg border border-green-500/20 px-3 py-2 flex flex-col justify-center">
                                    <span className="text-xs text-green-600 font-semibold mb-1">결제 혜택</span>
                                    <span className="text-sm font-bold">포인트 2배 적립</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="w-full bg-slate-50 dark:bg-slate-900/50 py-24 px-4 flex flex-col items-center border-y">
                <div className="max-w-6xl w-full space-y-16">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                            PayEvents가 시간을 아껴드립니다
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            매번 바뀌는 복잡한 이벤트 조건, 이제 발품 팔지 말고 한 곳에서 편하게 비교하세요.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <div key={i} className="bg-background p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-6 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 text-${feature.color}-600 dark:text-${feature.color}-400 ring-1 ring-${feature.color}-500/20`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                                <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br from-transparent to-${feature.color}-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works / Social Proof */}
            <section className="w-full max-w-5xl px-4 py-24 flex flex-col items-center text-center space-y-12">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">똑똑한 소비의 시작</h2>

                <div className="grid sm:grid-cols-2 gap-6 w-full text-left">
                    <div className="flex gap-4 p-6 border rounded-2xl bg-card">
                        <div className="flex-shrink-0 mt-1">
                            <CheckCircle2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-1">어떤 가맹점이든 빠르게</h4>
                            <p className="text-muted-foreground">식당, 카페, 편의점, 온라인 쇼핑몰까지 카테고리별로 필터링해서 볼 수 있어요.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-6 border rounded-2xl bg-card">
                        <div className="flex-shrink-0 mt-1">
                            <CheckCircle2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-1">상세한 조건까지 한눈에</h4>
                            <p className="text-muted-foreground">최소 결제 금액, 최대 할인 한도 등 숨겨진 유의사항도 명확하게 요약해 드립니다.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA CTA */}
            <section className="w-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white py-24 px-4 text-center">
                <div className="max-w-3xl mx-auto flex flex-col items-center space-y-8">
                    <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
                        지금 쓸 수 있는 <br className="sm:hidden" />혜택이 궁금하다면?
                    </h2>
                    <p className="text-white/80 text-lg sm:text-xl max-w-xl">
                        로그인이나 회원가입 없이 바로 확인하실 수 있습니다.
                        놓치기 아까운 할인 이벤트를 지금 만나보세요.
                    </p>
                    <div className="pt-4">
                        <Link href="/home">
                            <Button size="lg" variant="secondary" className="h-14 px-10 text-lg rounded-full shadow-xl hover:scale-105 transition-transform font-bold text-violet-700">
                                무료로 혜택 확인하기
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

const features = [
    {
        title: "한 곳에서 통합 검색",
        description: "각 페이 앱에 흩어져 있는 할인/적립 이벤트를 한 곳에 모았습니다. 찾고 싶은 브랜드나 결제처를 빠르게 검색하세요.",
        color: "violet",
        icon: <Search className="h-6 w-6" />,
    },
    {
        title: "놓치기 쉬운 마감순 정렬",
        description: "오늘 끝나는 파격 혜택, 더 이상 놓치지 마세요. D-Day 배지와 함께 종료 임박 이벤트를 가장 먼저 알려드립니다.",
        color: "pink",
        icon: <Zap className="h-6 w-6" />,
    },
    {
        title: "핵심 요약 알림",
        description: "복잡한 약관과 유의사항을 세 줄로 요약해 드립니다. 바쁜 당신을 위해 꼭 필요한 혜택 정보만 주간 뉴스레터로 보내드려요.",
        color: "fuchsia",
        icon: <Bell className="h-6 w-6" />,
    }
]
