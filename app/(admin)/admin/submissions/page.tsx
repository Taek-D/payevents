import Link from "next/link"
import { createAdminClient } from "@/lib/supabase/admin"
import { PROVIDERS } from "@/lib/constants/providers"

export const revalidate = 0

type StatusFilter = "pending" | "approved" | "rejected"

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "pending", label: "대기중" },
  { value: "approved", label: "승인됨" },
  { value: "rejected", label: "반려됨" },
]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

function truncate(str: string | null | undefined, max: number) {
  if (!str) return null
  return str.length > max ? str.slice(0, max) + "…" : str
}

function getProviderLabel(code: string) {
  return PROVIDERS.find((p) => p.value === code)?.label ?? code
}

function getProviderColor(code: string) {
  return PROVIDERS.find((p) => p.value === code)?.color ?? "#888"
}

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const status: StatusFilter =
    params.status === "approved" || params.status === "rejected"
      ? params.status
      : "pending"

  const supabase = createAdminClient()
  const { data: submissions } = await supabase
    .from("event_submissions")
    .select(
      "id, payment_provider_code, brand_name, source_url, title, benefit_text, created_at, status"
    )
    .eq("status", status)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">제보 검수</h1>

      {/* 상태 탭 */}
      <div className="flex gap-1 border-b border-gray-200">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin/submissions?status=${tab.value}`}
            className={[
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              status === tab.value
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700",
            ].join(" ")}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* 제보 목록 */}
      {submissions && submissions.length > 0 ? (
        <div className="space-y-3">
          {submissions.map((s) => {
            const providerColor = getProviderColor(s.payment_provider_code)
            const providerLabel = getProviderLabel(s.payment_provider_code)
            const truncatedUrl = truncate(s.source_url, 50)
            return (
              <div
                key={s.id}
                className="bg-white rounded-lg border border-gray-200 p-4 flex items-start justify-between gap-4"
              >
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: providerColor }}
                    >
                      {providerLabel}
                    </span>
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {s.brand_name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 truncate">{s.title}</p>
                  <p className="text-xs text-gray-500 truncate">{truncate(s.benefit_text, 60)}</p>
                  {s.source_url && (
                    <a
                      href={s.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:underline truncate block"
                    >
                      {truncatedUrl}
                    </a>
                  )}
                  <p className="text-xs text-gray-400">{formatDate(s.created_at)}</p>
                </div>
                <Link
                  href={`/admin/submissions/${s.id}`}
                  className="shrink-0 text-xs px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  상세보기
                </Link>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 py-16 text-center">
          <p className="text-2xl">{status === "pending" ? "🎉" : "📭"}</p>
          <p className="mt-2 text-sm text-gray-500">
            {status === "pending"
              ? "검수할 제보가 없어요"
              : `${STATUS_TABS.find((t) => t.value === status)?.label ?? ""} 제보가 없습니다`}
          </p>
        </div>
      )}
    </div>
  )
}
