import Link from "next/link"
import { createAdminClient } from "@/lib/supabase/admin"
import { CrawlSuggestions } from "@/components/admin/CrawlSuggestions"

export const revalidate = 0

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

function truncate(str: string | null | undefined, max: number) {
  if (!str) return "-"
  return str.length > max ? str.slice(0, max) + "…" : str
}

export default async function AdminDashboardPage() {
  const supabase = createAdminClient()
  const today = new Date().toISOString().slice(0, 10)

  const [{ count: pendingCount }, { count: endingTodayCount }, { data: recentSubmissions }] =
    await Promise.all([
      supabase
        .from("event_submissions")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .eq("end_date", today)
        .eq("status", "published"),
      supabase
        .from("event_submissions")
        .select("id, submitter_name, payment_provider_code, source_url, created_at")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(5),
    ])

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-bold text-gray-900">관리자 대시보드</h1>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-xs text-gray-500 mb-1">검수 대기</p>
          <p className="text-3xl font-bold text-orange-500">{pendingCount ?? 0}</p>
          <p className="text-xs text-gray-400 mt-1">건</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-xs text-gray-500 mb-1">오늘 종료 예정</p>
          <p className="text-3xl font-bold text-red-500">{endingTodayCount ?? 0}</p>
          <p className="text-xs text-gray-400 mt-1">개 이벤트</p>
        </div>
      </div>

      {/* 최근 제보 */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">최근 대기 중인 제보</h2>
          <Link
            href="/admin/submissions"
            className="text-xs text-blue-600 hover:underline"
          >
            전체 보기
          </Link>
        </div>
        {recentSubmissions && recentSubmissions.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {recentSubmissions.map((s) => (
              <li key={s.id} className="px-5 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-medium text-gray-500 shrink-0">
                    {s.payment_provider_code}
                  </span>
                  <span className="text-xs text-gray-700 truncate">
                    {s.submitter_name ?? "익명"}
                  </span>
                  <span className="text-xs text-gray-400 truncate hidden sm:block">
                    {truncate(s.source_url, 40)}
                  </span>
                </div>
                <span className="text-xs text-gray-400 shrink-0">
                  {formatDate(s.created_at)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-6 text-sm text-gray-400 text-center">
            대기 중인 제보가 없습니다.
          </p>
        )}
      </div>

      {/* 커뮤니티 이벤트 후보 */}
      <CrawlSuggestions />

      {/* 바로가기 버튼 */}
      <div className="flex gap-3">
        <Link
          href="/admin/submissions"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          제보 검수하기
        </Link>
        <Link
          href="/admin/events"
          className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
        >
          이벤트 관리
        </Link>
      </div>
    </div>
  )
}
