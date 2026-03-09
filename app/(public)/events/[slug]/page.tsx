import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { EventDetail } from "@/components/EventDetail"
import { formatDateRange } from "@/lib/utils/date"
import type { EventWithRelations } from "@/lib/types/event"

async function getEvent(slug: string): Promise<EventWithRelations | null> {
  const supabase = await createClient()

  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (error || !event) return null

  const [providerRes, categoryRes, brandRes] = await Promise.all([
    supabase
      .from("payment_providers")
      .select("id, code, name_ko")
      .eq("id", event.payment_provider_id)
      .single(),
    supabase
      .from("categories")
      .select("id, slug, name_ko")
      .eq("id", event.category_id)
      .single(),
    supabase
      .from("brands")
      .select("id, slug, name_ko")
      .eq("id", event.brand_id)
      .single(),
  ])

  return {
    ...event,
    payment_provider: providerRes.data,
    category: categoryRes.data,
    brand: brandRes.data,
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const event = await getEvent(slug)

  if (!event) {
    return { title: "이벤트를 찾을 수 없습니다" }
  }

  const providerCode = event.payment_provider?.code ?? ""
  const description = event.summary
    ? `${event.summary} | ${formatDateRange(event.start_date, event.end_date)}`
    : `${event.benefit_text} | ${formatDateRange(event.start_date, event.end_date)}`

  const ogImageUrl = `/api/og?title=${encodeURIComponent(event.title)}&provider=${providerCode}`

  return {
    title: event.title,
    description,
    openGraph: {
      title: event.title,
      description,
      type: "article",
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description,
      images: [ogImageUrl],
    },
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = await getEvent(slug)

  if (!event) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.summary ?? event.benefit_text,
    startDate: event.start_date,
    endDate: event.end_date,
    eventAttendanceMode: event.is_online
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    organizer: {
      "@type": "Organization",
      name: event.payment_provider?.name_ko ?? "PayEvents",
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/events/${event.slug}`,
      availability: "https://schema.org/InStock",
    },
    ...(event.image_url ? { image: event.image_url } : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EventDetail event={event} />
    </>
  )
}
