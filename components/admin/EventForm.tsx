"use client"

import { useState, useEffect, type FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { adminFetch } from "@/lib/admin/api"
import { CATEGORIES } from "@/lib/constants/categories"
import { PROVIDERS } from "@/lib/constants/providers"
import type { ScrapeResponse, ScrapeWarning } from "@/lib/scrapers"
import type { EventRow } from "@/lib/supabase/types"

type ProviderRow = { id: string; code: string; name_ko: string }
type CategoryRow = { id: string; slug: string; name_ko: string }
type BrandRow = { id: string; slug: string; name_ko: string }

type EventFormInitialData = Partial<{
  title: string
  summary: string | null
  payment_provider_id: string
  category_id: string
  brand_id: string
  benefit_text: string
  condition_text: string | null
  start_date: string
  end_date: string
  is_online: boolean
  is_offline: boolean
  image_url: string | null
  source_url: string | null
  source_type: string
  status: string
}>

export type EventFormProps = {
  mode: "create" | "edit"
  initialData?: EventFormInitialData
  eventId?: string
  onSuccess?: (event: EventRow) => void
}

const WARNING_LABELS: Record<ScrapeWarning, string> = {
  period_not_found: "기간: 자동으로 찾지 못했습니다. 수동 입력 필요",
  brand_ambiguous: "브랜드: 매칭 실패. 드롭다운에서 선택해주세요",
  image_not_found: "이미지: 자동으로 찾지 못했습니다",
  category_unknown: "카테고리: 추론 실패. 수동 선택 필요",
  jsonld_parse_failed: "구조화 데이터(JSON-LD) 파싱 실패",
  title_missing: "제목: 자동으로 찾지 못했습니다",
  spa_detected: "SPA 페이지 감지: 전체 수동 입력 필요",
}

function FieldWarningIcon({
  warnings,
  field,
}: {
  warnings: ScrapeWarning[]
  field: ScrapeWarning
}) {
  if (!warnings.includes(field)) return null
  return (
    <span
      title={WARNING_LABELS[field]}
      className="ml-1 inline-flex items-center text-amber-600"
      aria-label={WARNING_LABELS[field]}
    >
      ⚠
    </span>
  )
}

export function EventForm({ mode, initialData, eventId, onSuccess }: EventFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Scrape state (mode='create' 전용)
  const [scrapeUrl, setScrapeUrl] = useState("")
  const [scraping, setScraping] = useState(false)
  const [scrapeResult, setScrapeResult] = useState<ScrapeResponse | null>(null)
  const [autoScraped, setAutoScraped] = useState(false)

  // Form fields — initialData 로 prefill
  const [title, setTitle] = useState<string>(initialData?.title ?? "")
  const [summary, setSummary] = useState<string>(initialData?.summary ?? "")
  const [benefitText, setBenefitText] = useState<string>(initialData?.benefit_text ?? "")
  const [conditionText, setConditionText] = useState<string>(initialData?.condition_text ?? "")
  const [startDate, setStartDate] = useState<string>(initialData?.start_date ?? "")
  const [endDate, setEndDate] = useState<string>(initialData?.end_date ?? "")
  const [isOnline, setIsOnline] = useState<boolean>(initialData?.is_online ?? true)
  const [isOffline, setIsOffline] = useState<boolean>(initialData?.is_offline ?? false)
  const [imageUrl, setImageUrl] = useState<string>(initialData?.image_url ?? "")
  const [sourceUrl, setSourceUrl] = useState<string>(initialData?.source_url ?? "")
  const [sourceType, setSourceType] = useState<string>(initialData?.source_type ?? "official")
  const [statusValue, setStatusValue] = useState<string>(initialData?.status ?? "draft")

  // Lookup data
  const [providers, setProviders] = useState<ProviderRow[]>([])
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [brands, setBrands] = useState<BrandRow[]>([])
  const [providerId, setProviderId] = useState<string>(initialData?.payment_provider_id ?? "")
  const [categoryId, setCategoryId] = useState<string>(initialData?.category_id ?? "")
  const [brandId, setBrandId] = useState<string>(initialData?.brand_id ?? "")

  // UI state
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  // setState wrapper — dirty 자동 세팅
  function markDirty<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v)
      if (!dirty) setDirty(true)
    }
  }

  useEffect(() => {
    async function loadLookups() {
      try {
        const res = await adminFetch("/api/admin/lookups")
        if (res.ok) {
          const json = await res.json()
          setProviders(json.data.providers ?? [])
          setCategories(json.data.categories ?? [])
          setBrands(json.data.brands ?? [])
        }
      } catch {
        // 조용히 실패
      }
    }
    loadLookups()
  }, [])

  // mode='create' 일 때만 ?url= 자동 스크래핑 (Pitfall #3 guard)
  useEffect(() => {
    if (mode !== "create") return
    const urlParam = searchParams.get("url")
    if (urlParam && !autoScraped && providers.length > 0) {
      setScrapeUrl(urlParam)
      setAutoScraped(true)
      setTimeout(() => {
        document
          .querySelector<HTMLButtonElement>("[data-scrape-btn]")
          ?.click()
      }, 100)
    }
  }, [mode, searchParams, autoScraped, providers.length])

  // beforeunload dirty guard (D-03)
  useEffect(() => {
    if (!dirty) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [dirty])

  async function handleScrape() {
    if (mode !== "create") return
    if (!scrapeUrl.trim()) return
    setScraping(true)
    setScrapeResult(null)
    setError(null)
    try {
      const res = await adminFetch("/api/admin/scrape", {
        method: "POST",
        body: JSON.stringify({ url: scrapeUrl.trim() }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? "스크래핑 실패")
        return
      }
      const response = json as ScrapeResponse
      setScrapeResult(response)
      const data = response.data
      if (data.title && !title) setTitle(data.title)
      if (data.summary && !summary) setSummary(data.summary)
      if (data.benefitText && !benefitText) setBenefitText(data.benefitText)
      if (data.startDate && !startDate) setStartDate(data.startDate)
      if (data.endDate && !endDate) setEndDate(data.endDate)
      if (data.imageUrl && !imageUrl) setImageUrl(data.imageUrl)
      if (data.sourceUrl && !sourceUrl) setSourceUrl(data.sourceUrl)
      if (data.brandId && !brandId) setBrandId(data.brandId)
      if (response._provider !== "UNKNOWN" && !providerId) {
        const matched = providers.find((p) => p.code === response._provider)
        if (matched) setProviderId(matched.id)
      }
      if (data.categorySuggestion && !categoryId) {
        const matched = categories.find((c) => c.slug === data.categorySuggestion)
        if (matched) setCategoryId(matched.id)
      }
      if (response._scraped && response._provider !== "UNKNOWN") {
        setSourceType("official")
      }
      // scrape 결과로 prefill 된 것은 dirty 로 간주하지 않음 (사용자 의도가 아님)
    } catch {
      setError("네트워크 오류가 발생했습니다")
    } finally {
      setScraping(false)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const url =
        mode === "create"
          ? "/api/admin/events"
          : `/api/admin/events/${eventId}`
      const method = mode === "create" ? "POST" : "PATCH"

      // PATCH body 에는 status 절대 포함 X (Pitfall #2 + D-04)
      // eventCreateSchema 에 slug 자체가 없으므로 본 폼에서 slug 를 전송하지도 않음
      const baseBody = {
        title,
        summary: summary || undefined,
        payment_provider_id: providerId,
        category_id: categoryId,
        brand_id: brandId,
        benefit_text: benefitText,
        condition_text: conditionText || undefined,
        start_date: startDate,
        end_date: endDate,
        is_online: isOnline,
        is_offline: isOffline,
        image_url: imageUrl || undefined,
        source_url: sourceUrl || undefined,
        source_type: sourceType,
        is_verified: true,
        priority: 0,
      }

      const body =
        mode === "create"
          ? JSON.stringify({ ...baseBody, status: statusValue })
          : JSON.stringify(baseBody)

      const res = await adminFetch(url, { method, body })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? "저장 실패")
        return
      }

      setDirty(false)
      if (onSuccess && json.data) onSuccess(json.data as EventRow)
      router.push("/admin/events")
    } catch {
      setError("네트워크 오류가 발생했습니다")
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  const labelClass = "block text-xs font-medium text-gray-700 mb-1"
  const warnings = scrapeResult?.warnings ?? []

  return (
    <div className="space-y-6 max-w-2xl">
      {/* mode='create' 전용: SPA 감지 yellow banner */}
      {mode === "create" && scrapeResult && !scrapeResult._scraped && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg">
          <p className="text-sm font-medium text-yellow-900">
            이 페이지는 자동 채우기를 지원하지 않습니다. 수동으로 입력해주세요.
          </p>
          <p className="text-xs text-yellow-700 mt-1">
            원본 URL:{" "}
            <a
              href={scrapeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-yellow-900 break-all"
            >
              {scrapeUrl}
            </a>
          </p>
        </div>
      )}

      {/* mode='create' 전용: URL scrape UI */}
      {mode === "create" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <p className="text-sm font-medium text-blue-800">URL로 자동 채우기</p>
          <div className="flex gap-2">
            <input
              type="url"
              value={scrapeUrl}
              onChange={(e) => setScrapeUrl(e.target.value)}
              placeholder="이벤트 페이지 URL을 붙여넣으세요"
              className="flex-1 rounded-lg border border-blue-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleScrape()
                }
              }}
            />
            <button
              type="button"
              data-scrape-btn
              onClick={handleScrape}
              disabled={scraping || !scrapeUrl.trim()}
              className="shrink-0 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {scraping ? "가져오는 중..." : "가져오기"}
            </button>
          </div>
          {scrapeResult && (
            <div className="space-y-3">
              <div className="bg-white rounded-lg border border-blue-100 p-3 space-y-1">
                <p className="text-xs text-gray-500">
                  가져온 정보 (
                  {scrapeResult._provider === "UNKNOWN"
                    ? "일반"
                    : scrapeResult._provider}
                  )
                </p>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {scrapeResult.data.title || "(제목 없음)"}
                </p>
                {scrapeResult.data.summary && (
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {scrapeResult.data.summary}
                  </p>
                )}
                {scrapeResult.data.imageUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={scrapeResult.data.imageUrl}
                    alt="미리보기"
                    className="mt-2 rounded-md max-h-32 object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = "none"
                    }}
                  />
                )}
              </div>
              {scrapeResult.warnings.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-1">
                  <p className="text-xs font-medium text-amber-900">
                    {scrapeResult.warnings.length}개 필드를 자동으로 채우지 못했습니다
                  </p>
                  <ul className="text-xs text-amber-800 space-y-0.5">
                    {scrapeResult.warnings.map((w) => (
                      <li key={w}>• {WARNING_LABELS[w] ?? w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* 제목 */}
          <div className="sm:col-span-2">
            <label className={labelClass}>
              이벤트 제목 *
              <FieldWarningIcon warnings={warnings} field="title_missing" />
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => markDirty(setTitle)(e.target.value)}
              placeholder="토스페이 스타벅스 10% 할인"
              required
              className={inputClass}
            />
          </div>

          {/* 결제사 */}
          <div>
            <label className={labelClass}>결제사 *</label>
            <select
              value={providerId}
              onChange={(e) => markDirty(setProviderId)(e.target.value)}
              required
              className={inputClass}
            >
              <option value="">선택</option>
              {providers.map((p) => {
                const label =
                  PROVIDERS.find((pr) => pr.value === p.code)?.label ??
                  p.name_ko
                return (
                  <option key={p.id} value={p.id}>
                    {label}
                  </option>
                )
              })}
            </select>
          </div>

          {/* 카테고리 */}
          <div>
            <label className={labelClass}>
              카테고리 *
              <FieldWarningIcon warnings={warnings} field="category_unknown" />
            </label>
            <select
              value={categoryId}
              onChange={(e) => markDirty(setCategoryId)(e.target.value)}
              required
              className={inputClass}
            >
              <option value="">선택</option>
              {categories.map((c) => {
                const label =
                  CATEGORIES.find((cat) => cat.value === c.slug)?.label ??
                  c.name_ko
                return (
                  <option key={c.id} value={c.id}>
                    {label}
                  </option>
                )
              })}
            </select>
          </div>

          {/* 브랜드 */}
          <div className="sm:col-span-2">
            <label className={labelClass}>
              브랜드 *
              <FieldWarningIcon warnings={warnings} field="brand_ambiguous" />
            </label>
            <select
              value={brandId}
              onChange={(e) => markDirty(setBrandId)(e.target.value)}
              required
              className={inputClass}
            >
              <option value="">선택</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name_ko}
                </option>
              ))}
            </select>
          </div>

          {/* 요약 */}
          <div className="sm:col-span-2">
            <label className={labelClass}>요약</label>
            <input
              type="text"
              value={summary ?? ""}
              onChange={(e) => markDirty(setSummary)(e.target.value)}
              placeholder="한 줄 요약"
              className={inputClass}
            />
          </div>

          {/* 혜택 내용 */}
          <div className="sm:col-span-2">
            <label className={labelClass}>혜택 내용 *</label>
            <textarea
              value={benefitText}
              onChange={(e) => markDirty(setBenefitText)(e.target.value)}
              rows={3}
              required
              placeholder="예: 스타벅스에서 토스페이로 결제 시 10% 할인"
              className={`${inputClass} resize-y`}
            />
          </div>

          {/* 이용 조건 */}
          <div className="sm:col-span-2">
            <label className={labelClass}>이용 조건</label>
            <textarea
              value={conditionText ?? ""}
              onChange={(e) => markDirty(setConditionText)(e.target.value)}
              rows={2}
              placeholder="조건 없으면 비워두세요"
              className={`${inputClass} resize-y`}
            />
          </div>

          {/* 날짜 */}
          <div>
            <label className={labelClass}>
              시작일 *
              <FieldWarningIcon warnings={warnings} field="period_not_found" />
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => markDirty(setStartDate)(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              종료일 *
              <FieldWarningIcon warnings={warnings} field="period_not_found" />
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => markDirty(setEndDate)(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          {/* 온/오프라인 */}
          <div className="flex items-center gap-6 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={isOnline}
                onChange={(e) => markDirty(setIsOnline)(e.target.checked)}
                className="rounded border-gray-300"
              />
              온라인
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={isOffline}
                onChange={(e) => markDirty(setIsOffline)(e.target.checked)}
                className="rounded border-gray-300"
              />
              오프라인
            </label>
          </div>

          {/* 이미지 URL */}
          <div className="sm:col-span-2">
            <label className={labelClass}>
              이미지 URL
              <FieldWarningIcon warnings={warnings} field="image_not_found" />
            </label>
            <input
              type="url"
              value={imageUrl ?? ""}
              onChange={(e) => markDirty(setImageUrl)(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={inputClass}
            />
            {imageUrl && (
              <div className="mt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="이벤트 이미지 미리보기"
                  className="rounded-md max-h-40 object-contain border border-gray-200"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = "none"
                  }}
                />
              </div>
            )}
          </div>

          {/* 출처 URL */}
          <div className="sm:col-span-2">
            <label className={labelClass}>출처 URL</label>
            <input
              type="url"
              value={sourceUrl ?? ""}
              onChange={(e) => markDirty(setSourceUrl)(e.target.value)}
              placeholder="https://"
              className={inputClass}
            />
          </div>

          {/* 출처 유형 */}
          <div>
            <label className={labelClass}>출처 유형</label>
            <select
              value={sourceType}
              onChange={(e) => markDirty(setSourceType)(e.target.value)}
              className={inputClass}
            >
              <option value="official">공식</option>
              <option value="community">커뮤니티</option>
              <option value="submission">제보</option>
              <option value="crawled">크롤링</option>
            </select>
          </div>

          {/* 게시 상태: mode='create' 에서만 노출. mode='edit' 에서는 EventStatusButtons 가 별도 처리 */}
          {mode === "create" && (
            <div>
              <label className={labelClass}>게시 상태</label>
              <select
                value={statusValue}
                onChange={(e) => markDirty(setStatusValue)(e.target.value)}
                className={inputClass}
              >
                <option value="draft">임시저장</option>
                <option value="published">바로 게시</option>
              </select>
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "저장 중..." : mode === "create" ? "이벤트 등록" : "변경 저장"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/events")}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm hover:bg-gray-50"
          >
            취소
          </button>
          {dirty && (
            <span className="text-xs text-amber-600">저장하지 않은 변경사항이 있습니다</span>
          )}
        </div>
      </form>
    </div>
  )
}
