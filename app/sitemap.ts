import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"
import { CATEGORIES } from "@/lib/constants/categories"
import { PROVIDERS } from "@/lib/constants/providers"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const { data: events } = await supabase
    .from("events")
    .select("slug, updated_at")
    .eq("status", "published")

  const eventEntries: MetadataRoute.Sitemap = (events ?? []).map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: new Date(event.updated_at),
    changeFrequency: "daily",
    priority: 0.8,
  }))

  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/events?category=${cat.value}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  const providerEntries: MetadataRoute.Sitemap = PROVIDERS.map((provider) => ({
    url: `${baseUrl}/events?provider=${provider.value}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/home`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/newsletter`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ]

  return [...staticRoutes, ...categoryEntries, ...providerEntries, ...eventEntries]
}
