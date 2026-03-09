"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { adminFetch } from "@/lib/admin/api"
import { CATEGORIES } from "@/lib/constants/categories"
import { PROVIDERS } from "@/lib/constants/providers"

type ProviderRow = { id: string; code: string; name_ko: string }
type CategoryRow = { id: string; slug: string; name_ko: string }
type BrandRow = { id: string; slug: string; name_ko: string }

export default function CreateEventPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // URL 스크래핑
  const [scrapeUrl, setScrapeUrl] = useState("")
  const [scraping, setScraping] = useState(false)
  const [scrapeResult, setScrapeResult] = useState<{
    title: string
    description: string
    image: string
    siteName: string
    bodyImages?: string[]
  } | null>(null)

  // 폼 필드
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [benefitText, setBenefitText] = useState("")
  const [conditionText, setConditionText] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isOnline, setIsOnline] = useState(true)
  const [isOffline, setIsOffline] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [sourceUrl, setSourceUrl] = useState("")
  const [sourceType, setSourceType] = useState<string>("official")
  const [status, setStatus] = useState<string>("draft")

  // 셀렉트 데이터
  const [providers, setProviders] = useState<ProviderRow[]>([])
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [brands, setBrands] = useState<BrandRow[]>([])
  const [providerId, setProviderId] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [brandId, setBrandId] = useState("")

  // 상태
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [autoScraped, setAutoScraped] = useState(false)

  useEffect(() => {
    loadLookups()
  }, [])

  // URL 쿼리파라미터로 전달된 경우 자동 스크래핑
  useEffect(() => {
    const urlParam = searchParams.get("url")
    if (urlParam && !autoScraped && providers.length > 0) {
      setScrapeUrl(urlParam)
      setAutoScraped(true)
      // 다음 틱에서 스크래핑 실행 (state 업데이트 이후)
      setTimeout(() => {
        document.querySelector<HTMLButtonElement>("[data-scrape-btn]")?.click()
      }, 100)
    }
  }, [searchParams, autoScraped, providers.length])

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

  async function handleScrape() {
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

      const data = json.data
      setScrapeResult(data)

      // 폼 자동 채우기
      if (data.title && !title) setTitle(data.title)
      if (data.description && !summary) setSummary(data.description)
      if (data.description && !benefitText) setBenefitText(data.description)
      if (!sourceUrl) setSourceUrl(scrapeUrl.trim())

      // 이미지 자동 채우기: 본문 이미지 > OG 이미지
      if (!imageUrl) {
        const firstBodyImage = data.bodyImages?.[0]
        if (firstBodyImage) setImageUrl(firstBodyImage)
        else if (data.image) setImageUrl(data.image)
      }

      // 제목에서 결제사 자동 감지
      const titleText = data.title?.toLowerCase() ?? ""
      const PROVIDER_KEYWORDS: Record<string, string[]> = {
        NAVERPAY: ["네이버페이", "네이버 페이", "naverpay", "naver pay"],
        TOSSPAY: ["토스페이", "토스 페이", "토스", "tosspay", "toss"],
        KAKAOPAY: ["카카오페이", "카카오 페이", "kakaopay", "kakao pay"],
        PAYCO: ["페이코", "payco"],
      }
      for (const [code, keywords] of Object.entries(PROVIDER_KEYWORDS)) {
        if (keywords.some((kw) => titleText.includes(kw))) {
          const matched = providers.find((p) => p.code === code)
          if (matched && !providerId) setProviderId(matched.id)
          break
        }
      }

      // 제목에서 브랜드 자동 감지
      for (const brand of brands) {
        if (titleText.includes(brand.name_ko.toLowerCase())) {
          if (!brandId) setBrandId(brand.id)
          break
        }
      }

      // URL에서 출처 유형 자동 감지
      const url = scrapeUrl.trim().toLowerCase()
      const COMMUNITY_DOMAINS = [
        "ppomppu.co.kr",
        "clien.net",
        "fmkorea.com",
        "ruliweb.com",
        "dcinside.com",
        "theqoo.net",
      ]
      if (COMMUNITY_DOMAINS.some((d) => url.includes(d))) {
        setSourceType("community")
      } else if (
        url.includes("blog.naver.com") ||
        url.includes("instagram.com") ||
        url.includes("toss.im") ||
        url.includes("kakaopay.com") ||
        url.includes("payco.com") ||
        url.includes("pay.naver.com")
      ) {
        setSourceType("official")
      }
    } catch {
      setError("네트워크 오류가 발생했습니다")
    } finally {
      setScraping(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const res = await adminFetch("/api/admin/events", {
        method: "POST",
        body: JSON.stringify({
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
          status,
          priority: 0,
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? "이벤트 생성 실패")
        return
      }

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

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-xl font-bold text-gray-900">이벤트 등록</h1>

      {/* URL 자동 채우기 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
        <p className="text-sm font-medium text-blue-800">
          URL로 자동 채우기
        </p>
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
          <div className="bg-white rounded-lg border border-blue-100 p-3 space-y-1">
            <p className="text-xs text-gray-500">가져온 정보:</p>
            {scrapeResult.siteName && (
              <p className="text-xs text-gray-400">
                사이트: {scrapeResult.siteName}
              </p>
            )}
            <p className="text-sm font-medium text-gray-900 truncate">
              {scrapeResult.title || "(제목 없음)"}
            </p>
            <p className="text-xs text-gray-600 line-clamp-2">
              {scrapeResult.description || "(설명 없음)"}
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {scrapeResult.image && (
              <img
                src={scrapeResult.image}
                alt="미리보기"
                className="mt-2 rounded-md max-h-32 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none"
                }}
              />
            )}
            {scrapeResult.bodyImages && scrapeResult.bodyImages.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-medium text-gray-500">
                  본문 이미지 ({scrapeResult.bodyImages.length}개)
                  <span className="text-gray-400 font-normal ml-1">— 클릭하면 이벤트 이미지로 설정</span>
                </p>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {scrapeResult.bodyImages.map((imgUrl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImageUrl(imgUrl)}
                      className={`rounded-md border overflow-hidden text-left transition-all ${
                        imageUrl === imgUrl
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-100 hover:border-blue-300"
                      } bg-gray-50`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgUrl}
                        alt={`본문 이미지 ${i + 1}`}
                        className="w-full object-contain"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement
                          img.style.display = "none"
                          const fallback = img.nextElementSibling as HTMLElement
                          if (fallback) fallback.style.display = "block"
                        }}
                      />
                      <div className="hidden px-3 py-2">
                        <p className="text-[10px] text-gray-400 mb-1">클릭하여 이미지로 설정:</p>
                        <span className="text-xs text-blue-600 break-all">
                          {imgUrl}
                        </span>
                      </div>
                      {imageUrl === imgUrl && (
                        <p className="px-2 py-1 text-[10px] text-blue-600 font-medium bg-blue-50">선택됨</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 이벤트 폼 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* 제목 */}
          <div className="sm:col-span-2">
            <label className={labelClass}>이벤트 제목 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              onChange={(e) => setProviderId(e.target.value)}
              required
              className={inputClass}
            >
              <option value="">선택</option>
              {providers.map((p) => {
                const label =
                  PROVIDERS.find((pr) => pr.value === p.code)?.label ?? p.name_ko
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
            <label className={labelClass}>카테고리 *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className={inputClass}
            >
              <option value="">선택</option>
              {categories.map((c) => {
                const label =
                  CATEGORIES.find((cat) => cat.value === c.slug)?.label ?? c.name_ko
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
            <label className={labelClass}>브랜드 *</label>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
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
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="한 줄 요약"
              className={inputClass}
            />
          </div>

          {/* 혜택 내용 */}
          <div className="sm:col-span-2">
            <label className={labelClass}>혜택 내용 *</label>
            <textarea
              value={benefitText}
              onChange={(e) => setBenefitText(e.target.value)}
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
              value={conditionText}
              onChange={(e) => setConditionText(e.target.value)}
              rows={2}
              placeholder="조건 없으면 비워두세요"
              className={`${inputClass} resize-y`}
            />
          </div>

          {/* 날짜 */}
          <div>
            <label className={labelClass}>시작일 *</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>종료일 *</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
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
                onChange={(e) => setIsOnline(e.target.checked)}
                className="rounded border-gray-300"
              />
              온라인
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={isOffline}
                onChange={(e) => setIsOffline(e.target.checked)}
                className="rounded border-gray-300"
              />
              오프라인
            </label>
          </div>

          {/* 이미지 URL */}
          <div className="sm:col-span-2">
            <label className={labelClass}>이미지 URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
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
                    (e.target as HTMLImageElement).style.display = "none"
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
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://"
              className={inputClass}
            />
          </div>

          {/* 출처 유형 */}
          <div>
            <label className={labelClass}>출처 유형</label>
            <select
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value)}
              className={inputClass}
            >
              <option value="official">공식</option>
              <option value="community">커뮤니티</option>
              <option value="submission">제보</option>
              <option value="crawled">크롤링</option>
            </select>
          </div>

          {/* 게시 상태 */}
          <div>
            <label className={labelClass}>게시 상태</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass}
            >
              <option value="draft">임시저장</option>
              <option value="published">바로 게시</option>
            </select>
          </div>
        </div>

        {/* 에러 */}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* 제출 버튼 */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "등록 중..." : "이벤트 등록"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/events")}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm hover:bg-gray-50"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  )
}
