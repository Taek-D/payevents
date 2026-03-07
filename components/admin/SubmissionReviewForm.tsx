"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { adminFetch } from "@/lib/admin/api"
import { CATEGORIES } from "@/lib/constants/categories"
import type { EventSubmissionRow } from "@/lib/supabase/types"

type Props = {
  submission: EventSubmissionRow
}

export function SubmissionReviewForm({ submission: s }: Props) {
  const router = useRouter()

  const [title, setTitle] = useState(s.title)
  const [brandName, setBrandName] = useState(s.brand_name)
  const [benefitText, setBenefitText] = useState(s.benefit_text)
  const [conditionText, setConditionText] = useState(s.condition_text ?? "")
  const [startDate, setStartDate] = useState(s.start_date ?? "")
  const [endDate, setEndDate] = useState(s.end_date ?? "")
  const [categorySlug, setCategorySlug] = useState(s.category_slug)
  const [sourceUrl, setSourceUrl] = useState(s.source_url ?? "")

  const [adminNote, setAdminNote] = useState("")
  const [showRejectForm, setShowRejectForm] = useState(false)

  const [approving, setApproving] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleApprove() {
    setError(null)
    setApproving(true)
    try {
      const res = await adminFetch(`/api/admin/submissions/${s.id}/approve`, {
        method: "POST",
        body: JSON.stringify({
          title,
          brandName,
          benefitText,
          conditionText: conditionText || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          categorySlug,
          sourceUrl: sourceUrl || undefined,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? json.message ?? "승인 중 오류가 발생했습니다.")
        return
      }
      router.push("/admin/submissions")
    } catch {
      setError("네트워크 오류가 발생했습니다.")
    } finally {
      setApproving(false)
    }
  }

  async function handleReject() {
    setError(null)
    setRejecting(true)
    try {
      const res = await adminFetch(`/api/admin/submissions/${s.id}/reject`, {
        method: "POST",
        body: JSON.stringify({
          adminNote: adminNote || undefined,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? json.message ?? "반려 중 오류가 발생했습니다.")
        return
      }
      router.push("/admin/submissions")
    } catch {
      setError("네트워크 오류가 발생했습니다.")
    } finally {
      setRejecting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* 편집 필드 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            이벤트 제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            브랜드명
          </label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            카테고리
          </label>
          <select
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            혜택 내용
          </label>
          <textarea
            value={benefitText}
            onChange={(e) => setBenefitText(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            이용 조건
          </label>
          <textarea
            value={conditionText}
            onChange={(e) => setConditionText(e.target.value)}
            rows={2}
            placeholder="조건 없으면 비워두세요"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            시작일
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            종료일
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            출처 URL
          </label>
          <input
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="https://"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 반려 메모 입력 */}
      {showRejectForm && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            반려 사유 (선택)
          </label>
          <textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            rows={3}
            placeholder="제보자에게 전달할 반려 사유를 입력하세요"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-y"
          />
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* 액션 버튼 */}
      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={handleApprove}
          disabled={approving || rejecting}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {approving ? "승인 중..." : "승인하여 게시"}
        </button>

        {!showRejectForm ? (
          <button
            onClick={() => setShowRejectForm(true)}
            disabled={approving || rejecting}
            className="inline-flex items-center px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            반려
          </button>
        ) : (
          <>
            <button
              onClick={handleReject}
              disabled={approving || rejecting}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {rejecting ? "반려 중..." : "반려 확정"}
            </button>
            <button
              onClick={() => {
                setShowRejectForm(false)
                setAdminNote("")
              }}
              disabled={rejecting}
              className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              취소
            </button>
          </>
        )}
      </div>
    </div>
  )
}
