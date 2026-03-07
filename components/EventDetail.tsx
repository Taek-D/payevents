import Link from "next/link"
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Gift,
  ListChecks,
  Calculator,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/StatusBadge"
import { ShareButton } from "@/components/ShareButton"
import { getDaysUntilEnd, isEndingSoon, isExpired, formatDateRange } from "@/lib/utils/date"
import { formatKRW } from "@/lib/utils/money"
import { PROVIDER_BADGE_COLORS } from "@/lib/constants/providers"
import type { EventWithRelations } from "@/lib/types/event"

function getRemainingText(endDate: string): string {
  const days = getDaysUntilEnd(endDate)
  if (days < 0) return "종료됨"
  if (days === 0) return "오늘 종료"
  if (days === 1) return "내일 종료"
  if (days <= 3) return `${days}일 후 종료`
  return `${days}일 남음`
}

type EventDetailProps = {
  event: EventWithRelations
}

export function EventDetail({ event }: EventDetailProps) {
  const providerCode = event.payment_provider?.code ?? ""
  const providerColor =
    PROVIDER_BADGE_COLORS[providerCode] ?? "bg-gray-500 text-white"
  const endingSoon = isEndingSoon(event.end_date)
  const expired = isExpired(event.end_date)
  const days = getDaysUntilEnd(event.end_date)

  return (
    <article className="mx-auto max-w-2xl">
      {/* Navigation + Badges */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/events"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          목록으로
        </Link>
        <div className="flex items-center gap-2">
          <Badge className={providerColor}>
            {event.payment_provider?.name_ko ?? "결제사"}
          </Badge>
          <Badge variant="outline">
            {event.category?.name_ko ?? "카테고리"}
          </Badge>
        </div>
      </div>

      {/* Title + Status */}
      <div className="mb-6">
        <div className="flex items-start gap-3">
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
            {event.title}
          </h1>
          <div className="shrink-0 pt-1">
            <StatusBadge endDate={event.end_date} status={event.status} />
          </div>
        </div>
        {endingSoon && !expired && (
          <div className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {days === 0 ? "오늘 종료" : `D-${days}`} 종료 임박
          </div>
        )}
      </div>

      {/* Summary */}
      {event.summary && (
        <p className="mb-6 leading-relaxed text-muted-foreground">
          {event.summary}
        </p>
      )}

      {/* Benefit */}
      <section className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <Gift className="size-5 text-primary" />
          <h2 className="text-lg font-semibold">혜택</h2>
        </div>
        <div className="rounded-xl border border-primary/10 bg-primary/5 px-5 py-4">
          <p className="text-lg font-semibold text-primary">
            {event.benefit_text}
          </p>
        </div>
      </section>

      {/* Conditions */}
      {event.condition_text && (
        <section className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <ListChecks className="size-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">조건</h2>
          </div>
          <ul className="space-y-2 rounded-xl bg-muted/50 px-5 py-4">
            {event.condition_text
              .split("\n")
              .filter(Boolean)
              .map((line, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm leading-relaxed"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                  {line.trim()}
                </li>
              ))}
          </ul>
        </section>
      )}

      {/* Period */}
      <section className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <Calendar className="size-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">기간</h2>
        </div>
        <div className="rounded-xl bg-muted/50 px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {formatDateRange(event.start_date, event.end_date)}
            </span>
            <span
              className={`text-sm font-medium ${
                expired
                  ? "text-gray-500"
                  : endingSoon
                    ? "text-red-600"
                    : "text-green-600"
              }`}
            >
              {getRemainingText(event.end_date)}
            </span>
          </div>
        </div>
      </section>

      {/* Benefit Calculation */}
      {event.max_benefit_value && (
        <section className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <Calculator className="size-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">예시 계산</h2>
          </div>
          <div className="rounded-xl bg-muted/50 px-5 py-4">
            <p className="text-sm text-muted-foreground">
              결제 시 최대 혜택 금액
            </p>
            <p className="mt-1 text-2xl font-bold text-primary">
              {formatKRW(event.max_benefit_value)}
            </p>
          </div>
        </section>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {event.source_url && (
          <a
            href={event.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button size="lg" className="w-full gap-2">
              <ExternalLink className="size-4" />
              원문 보기
            </Button>
          </a>
        )}
        <ShareButton
          title={event.title}
          text={event.summary ?? event.benefit_text}
        />
      </div>

      {/* Meta Info */}
      <div className="mt-8 border-t pt-4 text-xs text-muted-foreground">
        <div className="flex flex-wrap gap-4">
          {event.brand?.name_ko && <span>브랜드: {event.brand.name_ko}</span>}
          {event.is_online && <span>온라인</span>}
          {event.is_offline && <span>오프라인</span>}
          {event.stacking_possible && <span>중복 적용 가능</span>}
          <span>조회 {event.view_count.toLocaleString()}</span>
        </div>
      </div>
    </article>
  )
}
