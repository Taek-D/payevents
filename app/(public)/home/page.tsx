import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { HeroSection } from "@/components/HeroSection"
import { FeaturedSection } from "@/components/FeaturedSection"
import { EndingSoonSection } from "@/components/EndingSoonSection"
import { PopularSection } from "@/components/PopularSection"
import { NewsletterBanner } from "@/components/NewsletterBanner"

export const revalidate = 600

export const metadata: Metadata = {
  title: { absolute: "PayEvents — 오늘 뭐 쓰면 이득일까?" },
  description:
    "네이버페이·토스페이·카카오페이·페이코 간편결제 할인 이벤트를 한곳에서 확인하세요.",
  openGraph: {
    title: "PayEvents — 오늘 뭐 쓰면 이득일까?",
    description:
      "네이버페이·토스페이·카카오페이·페이코 간편결제 할인 이벤트를 한곳에서 확인하세요.",
    type: "website",
    images: [{ url: "/api/og?title=PayEvents", width: 1200, height: 630 }],
  },
}

const EVENT_SELECT = `
  *,
  payment_provider:payment_providers(id, code, name_ko),
  category:categories(id, slug, name_ko),
  brand:brands(id, slug, name_ko)
` as const

export default async function HomePage() {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]

  const threeDaysLater = new Date()
  threeDaysLater.setDate(threeDaysLater.getDate() + 3)
  const thresholdDate = threeDaysLater.toISOString().split("T")[0]

  const [featuredRes, endingSoonRes, popularRes] = await Promise.all([
    supabase
      .from("events")
      .select(EVENT_SELECT)
      .eq("status", "published" as const)
      .order("priority", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(6),
    supabase
      .from("events")
      .select(EVENT_SELECT)
      .eq("status", "published" as const)
      .gte("end_date", today)
      .lte("end_date", thresholdDate)
      .order("end_date", { ascending: true })
      .limit(4),
    supabase
      .from("events")
      .select(EVENT_SELECT)
      .eq("status", "published" as const)
      .order("view_count", { ascending: false })
      .limit(6),
  ])

  const featured = featuredRes.data ?? []
  const endingSoon = endingSoonRes.data ?? []
  const popular = popularRes.data ?? []

  return (
    <div className="space-y-12 pb-8">
      <HeroSection />
      <FeaturedSection events={featured} />
      <EndingSoonSection events={endingSoon} />
      <NewsletterBanner />
      <PopularSection events={popular} />
    </div>
  )
}
