"use client"

import Link from "next/link"
import { CATEGORIES } from "@/lib/constants/categories"

const CATEGORY_ICONS: Record<string, string> = {
  delivery: "🛵",
  cafe: "☕",
  shopping: "🛍️",
  convenience: "🏪",
  mart: "🛒",
  beauty: "💄",
  transport: "🚌",
}

export function CategoryGrid() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap sm:justify-center sm:overflow-visible">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.value}
          href={`/events?category=${cat.value}`}
          className="flex shrink-0 flex-col items-center gap-1.5 rounded-xl border bg-card px-4 py-3 text-sm font-medium transition-colors hover:border-primary hover:bg-primary/5 sm:px-5"
        >
          <span className="text-2xl">{CATEGORY_ICONS[cat.value] ?? "📦"}</span>
          <span>{cat.label}</span>
        </Link>
      ))}
    </div>
  )
}
