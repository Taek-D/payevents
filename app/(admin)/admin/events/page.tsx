import Link from "next/link"
import { createAdminClient } from "@/lib/supabase/admin"
import { PROVIDERS } from "@/lib/constants/providers"
import { PublishButton } from "@/components/admin/PublishButton"

export const revalidate = 0

type EventStatus = "published" | "draft" | "archived"

const STATUS_TABS: { value: EventStatus | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "published", label: "게시중" },
  { value: "draft", label: "임시저장" },
  { value: "archived", label: "보관" },
]

const STATUS_BADGE: Record<EventStatus, { label: string; className: string }> = {
  published: { label: "게시중", className: "bg-green-100 text-green-700" },
  draft: { label: "임시저장", className: "bg-gray-100 text-gray-600" },
  archived: { label: "보관", className: "bg-yellow-100 text-yellow-700" },
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

export default async function EventsManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const status = params.status as EventStatus | "all" | undefined
  const activeTab: EventStatus | "all" =
    status === "published" || status === "draft" || status === "archived"
      ? status
      : "all"

  const supabase = createAdminClient()

  // Fetch events with provider info via join
  const query = supabase
    .from("events")
    .select(
      "id, slug, title, status, start_date, end_date, payment_provider_id"
    )
    .order("created_at", { ascending: false })
    .limit(100)

  if (activeTab !== "all") {
    query.eq("status", activeTab)
  }

  const { data: events } = await query

  // Fetch payment providers for label mapping
  const { data: providers } = await supabase
    .from("payment_providers")
    .select("id, code, name_ko")

  const providerMap = new Map(providers?.map((p) => [p.id, p]) ?? [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">이벤트 관리</h1>
        <Link
          href="/admin/events/create"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          이벤트 등록
        </Link>
      </div>

      {/* 상태 탭 */}
      <div className="flex gap-1 border-b border-gray-200">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value === "all" ? "/admin/events" : `/admin/events?status=${tab.value}`}
            className={[
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              activeTab === tab.value
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700",
            ].join(" ")}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* 이벤트 목록 */}
      {events && events.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          {events.map((event) => {
            const provider = providerMap.get(event.payment_provider_id)
            const providerCode = provider?.code ?? ""
            const providerLabel =
              PROVIDERS.find((p) => p.value === providerCode)?.label ??
              provider?.name_ko ??
              providerCode
            const providerColor =
              PROVIDERS.find((p) => p.value === providerCode)?.color ?? "#888"
            const badge = STATUS_BADGE[event.status as EventStatus] ?? {
              label: event.status,
              className: "bg-gray-100 text-gray-600",
            }
            return (
              <div key={event.id} className="px-4 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1 flex items-center gap-3">
                  {providerLabel && (
                    <span
                      className="inline-flex shrink-0 items-center px-2 py-0.5 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: providerColor }}
                    >
                      {providerLabel}
                    </span>
                  )}
                  <span className="text-sm text-gray-900 truncate">{event.title}</span>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span
                    className={[
                      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                      badge.className,
                    ].join(" ")}
                  >
                    {badge.label}
                  </span>
                  <span className="text-xs text-gray-500 hidden sm:block">
                    {formatDate(event.start_date)} ~ {formatDate(event.end_date)}
                  </span>
                  {event.status === "published" ? (
                    <Link
                      href={`/events/${event.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:underline"
                    >
                      보기
                    </Link>
                  ) : event.status === "draft" ? (
                    <PublishButton eventId={event.id} />
                  ) : (
                    <span className="text-xs text-gray-300">보관됨</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 py-16 text-center">
          <p className="text-sm text-gray-400">해당 상태의 이벤트가 없습니다.</p>
        </div>
      )}
    </div>
  )
}
