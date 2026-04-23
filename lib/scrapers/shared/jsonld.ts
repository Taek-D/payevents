import type { CheerioAPI } from "cheerio"

export type OfferLike = {
  "@type"?: string | string[]
  name?: string
  description?: string
  image?: string | string[] | { url?: string }
  validFrom?: string
  validThrough?: string
  priceValidUntil?: string
  price?: number | string
  priceCurrency?: string
}

export type JsonLdResult = {
  offers: OfferLike[]
  parseFailed: boolean  // true if at least one <script> block failed JSON.parse
}

export function extractJsonLdOffers($: CheerioAPI): JsonLdResult {
  const offers: OfferLike[] = []
  let parseFailed = false

  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).contents().text().trim()
    if (!raw) return
    try {
      const parsed = JSON.parse(raw)
      collectOffers(parsed, offers)
    } catch {
      parseFailed = true
    }
  })

  return { offers, parseFailed }
}

function collectOffers(node: unknown, acc: OfferLike[]): void {
  if (Array.isArray(node)) {
    node.forEach((n) => collectOffers(n, acc))
    return
  }
  if (node && typeof node === "object") {
    const obj = node as Record<string, unknown>
    const t = obj["@type"]
    if (t === "Offer" || (Array.isArray(t) && t.includes("Offer"))) {
      acc.push(obj as OfferLike)
    }
    if ("offers" in obj) collectOffers(obj.offers, acc)
    if ("@graph" in obj) collectOffers(obj["@graph"], acc)
  }
}

export function firstOfferImage(offer: OfferLike | undefined): string | null {
  if (!offer) return null
  const img = offer.image
  if (typeof img === "string") return img
  if (Array.isArray(img)) return typeof img[0] === "string" ? img[0] : null
  if (img && typeof img === "object" && typeof img.url === "string") return img.url
  return null
}
