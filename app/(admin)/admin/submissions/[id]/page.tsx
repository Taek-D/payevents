import { notFound } from "next/navigation"
import Link from "next/link"
import { createAdminClient } from "@/lib/supabase/admin"
import { PROVIDERS } from "@/lib/constants/providers"
import { CATEGORIES } from "@/lib/constants/categories"
import { SubmissionReviewForm } from "@/components/admin/SubmissionReviewForm"
import type { EventSubmissionRow } from "@/lib/supabase/types"

export const revalidate = 0

function formatDate(dateStr: string | null) {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getProviderLabel(code: string) {
  return PROVIDERS.find((p) => p.value === code)?.label ?? code
}

function getProviderColor(code: string) {
  return PROVIDERS.find((p) => p.value === code)?.color ?? "#888"
}

function getCategoryLabel(slug: string) {
  return CATEGORIES.find((c) => c.value === slug)?.label ?? slug
}

const STATUS_DISPLAY: Record<
  EventSubmissionRow["status"],
  { label: string; className: string }
> = {
  pending: { label: "검수 대기", className: "bg-orange-100 text-orange-700" },
  approved: { label: "승인됨", className: "bg-green-100 text-green-700" },
  rejected: { label: "반려됨", className: "bg-red-100 text-red-700" },
}

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createAdminClient()
  const { data: submission } = await supabase
    .from("event_submissions")
    .select("*")
    .eq("id", id)
    .single()

  if (!submission) notFound()

  const s = submission as EventSubmissionRow
  const statusDisplay = STATUS_DISPLAY[s.status]
  const providerColor = getProviderColor(s.payment_provider_code)
  const providerLabel = getProviderLabel(s.payment_provider_code)

  return (
    <div className="space-y-6 max-w-3xl">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/submissions"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; 제보 목록
        </Link>
        <span className="text-gray-300">|</span>
        <span
          className={[
            "inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium",
            statusDisplay.className,
          ].join(" ")}
        >
          {statusDisplay.label}
        </span>
      </div>

      <h1 className="text-xl font-bold text-gray-900">{s.title}</h1>

      {/* 제보 정보 */}
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
        <div className="px-5 py-3 grid grid-cols-3 gap-2 text-sm">
          <span className="text-gray-500">결제사</span>
          <span className="col-span-2">
            <span
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white"
              style={{ backgroundColor: providerColor }}
            >
              {providerLabel}
            </span>
          </span>
        </div>
        <div className="px-5 py-3 grid grid-cols-3 gap-2 text-sm">
          <span className="text-gray-500">브랜드</span>
          <span className="col-span-2 text-gray-900">{s.brand_name}</span>
        </div>
        <div className="px-5 py-3 grid grid-cols-3 gap-2 text-sm">
          <span className="text-gray-500">카테고리</span>
          <span className="col-span-2 text-gray-900">{getCategoryLabel(s.category_slug)}</span>
        </div>
        <div className="px-5 py-3 grid grid-cols-3 gap-2 text-sm">
          <span className="text-gray-500">혜택</span>
          <span className="col-span-2 text-gray-900">{s.benefit_text}</span>
        </div>
        {s.condition_text && (
          <div className="px-5 py-3 grid grid-cols-3 gap-2 text-sm">
            <span className="text-gray-500">조건</span>
            <span className="col-span-2 text-gray-900">{s.condition_text}</span>
          </div>
        )}
        {s.summary && (
          <div className="px-5 py-3 grid grid-cols-3 gap-2 text-sm">
            <span className="text-gray-500">요약</span>
            <span className="col-span-2 text-gray-900">{s.summary}</span>
          </div>
        )}
        <div className="px-5 py-3 grid grid-cols-3 gap-2 text-sm">
          <span className="text-gray-500">이벤트 기간</span>
          <span className="col-span-2 text-gray-900">
            {formatDate(s.start_date)} ~ {formatDate(s.end_date)}
          </span>
        </div>
        {s.source_url && (
          <div className="px-5 py-3 grid grid-cols-3 gap-2 text-sm">
            <span className="text-gray-500">출처 URL</span>
            <span className="col-span-2">
              <a
                href={s.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {s.source_url}
              </a>
            </span>
          </div>
        )}
        {s.screenshot_url && (
          <div className="px-5 py-3 grid grid-cols-3 gap-2 text-sm">
            <span className="text-gray-500">스크린샷</span>
            <span className="col-span-2">
              <a
                href={s.screenshot_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {s.screenshot_url}
              </a>
            </span>
          </div>
        )}
        <div className="px-5 py-3 grid grid-cols-3 gap-2 text-sm">
          <span className="text-gray-500">제보자</span>
          <span className="col-span-2 text-gray-900">
            {s.submitter_name ?? "익명"}
            {s.submitter_email ? ` (${s.submitter_email})` : ""}
          </span>
        </div>
        <div className="px-5 py-3 grid grid-cols-3 gap-2 text-sm">
          <span className="text-gray-500">제보일시</span>
          <span className="col-span-2 text-gray-900">{formatDateTime(s.created_at)}</span>
        </div>
        {s.admin_note && (
          <div className="px-5 py-3 grid grid-cols-3 gap-2 text-sm">
            <span className="text-gray-500">관리자 메모</span>
            <span className="col-span-2 text-gray-900">{s.admin_note}</span>
          </div>
        )}
        {s.approved_event_id && (
          <div className="px-5 py-3 grid grid-cols-3 gap-2 text-sm">
            <span className="text-gray-500">승인된 이벤트</span>
            <span className="col-span-2">
              <Link
                href={`/events/${s.approved_event_id}`}
                className="text-blue-600 hover:underline"
              >
                이벤트 보기
              </Link>
            </span>
          </div>
        )}
      </div>

      {/* 검수 폼 — pending인 경우에만 표시 */}
      {s.status === "pending" && (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">검수 처리</h2>
          <SubmissionReviewForm submission={s} />
        </div>
      )}
    </div>
  )
}
