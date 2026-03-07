import { CategoryGrid } from "@/components/CategoryGrid"

export function HeroSection() {
  return (
    <section className="py-12 text-center sm:py-16">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
        오늘 뭐 쓰면 이득일까?
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        지금 쓸 수 있는 간편결제 이벤트 정리
      </p>
      <div className="mt-8">
        <CategoryGrid />
      </div>
    </section>
  )
}
