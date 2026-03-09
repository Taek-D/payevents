"use client"

import Link from "next/link"
import { Bike, Coffee, ShoppingBag, Store, ShoppingCart, Sparkles, Bus, Package } from "lucide-react"
import { CATEGORIES } from "@/lib/constants/categories"
import type { LucideIcon } from "lucide-react"

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  delivery: Bike,
  cafe: Coffee,
  shopping: ShoppingBag,
  convenience: Store,
  mart: ShoppingCart,
  beauty: Sparkles,
  transport: Bus,
}

export function CategoryGrid() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap sm:justify-center sm:overflow-visible">
      {CATEGORIES.map((cat) => {
        const Icon = CATEGORY_ICONS[cat.value] ?? Package
        return (
          <Link
            key={cat.value}
            href={`/events?category=${cat.value}`}
            className="flex shrink-0 flex-col items-center gap-1.5 rounded-xl border bg-card px-4 py-3 text-sm font-medium transition-colors hover:border-primary hover:bg-primary/5 sm:px-5"
          >
            <Icon className="h-6 w-6 text-muted-foreground" />
            <span>{cat.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
