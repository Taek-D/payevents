import Link from "next/link"
import { ArrowRight } from "lucide-react"

type SectionHeaderProps = {
  title: string
  subtitle?: string
  href?: string
}

export function SectionHeader({ title, subtitle, href }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          더보기
          <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  )
}
