"use client"

import { useState } from "react"
import Link from "next/link"
import { adminFetch } from "@/lib/admin/api"

type CrawledPost = {
  title: string
  url: string
  source: string
  matchedKeywords: string[]
}

type CrawlMeta = {
  total: number
  sources: string[]
  errors?: string[]
  crawledAt: string
}

export function CrawlSuggestions() {
  const [posts, setPosts] = useState<CrawledPost[]>([])
  const [meta, setMeta] = useState<CrawlMeta | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCrawl() {
    setLoading(true)
    setError(null)

    try {
      const res = await adminFetch("/api/admin/crawl")
      const json = await res.json()

      if (!res.ok) {
        setError(json.error ?? "크롤링 실패")
        return
      }

      setPosts(json.data)
      setMeta(json.meta)
    } catch {
      setError("네트워크 오류가 발생했습니다")
    } finally {
      setLoading(false)
    }
  }

  const KEYWORD_COLORS: Record<string, string> = {
    네이버페이: "bg-green-100 text-green-700",
    토스페이: "bg-blue-100 text-blue-700",
    토스: "bg-blue-100 text-blue-700",
    카카오페이: "bg-yellow-100 text-yellow-800",
    페이코: "bg-red-100 text-red-700",
  }

  function getKeywordColor(keyword: string): string {
    const lower = keyword.toLowerCase()
    for (const [key, color] of Object.entries(KEYWORD_COLORS)) {
      if (lower.includes(key.toLowerCase())) return color
    }
    return "bg-gray-100 text-gray-600"
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            커뮤니티 이벤트 후보
          </h2>
          {meta && (
            <p className="text-xs text-gray-400 mt-0.5">
              {meta.sources.join(", ")} · {meta.total}건 발견
            </p>
          )}
        </div>
        <button
          onClick={handleCrawl}
          disabled={loading}
          className="inline-flex items-center px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "검색 중..." : "커뮤니티 검색"}
        </button>
      </div>

      {error && (
        <p className="px-5 py-3 text-sm text-red-600 bg-red-50">
          {error}
        </p>
      )}

      {meta?.errors && meta.errors.length > 0 && (
        <div className="px-5 py-2 bg-yellow-50 border-b border-yellow-100">
          {meta.errors.map((err, i) => (
            <p key={i} className="text-xs text-yellow-700">{err}</p>
          ))}
        </div>
      )}

      {posts.length > 0 ? (
        <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
          {posts.map((post, i) => (
            <li key={i} className="px-5 py-3 hover:bg-gray-50">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400 shrink-0">
                      {post.source}
                    </span>
                    {post.matchedKeywords.slice(0, 2).map((kw) => (
                      <span
                        key={kw}
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${getKeywordColor(kw)}`}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-900 truncate">
                    {post.title}
                  </p>
                </div>
                <Link
                  href={`/admin/events/create?url=${encodeURIComponent(post.url)}`}
                  className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100"
                >
                  등록
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : !loading && meta ? (
        <p className="px-5 py-6 text-sm text-gray-400 text-center">
          결제 관련 이벤트를 찾지 못했습니다.
        </p>
      ) : !loading ? (
        <p className="px-5 py-6 text-sm text-gray-400 text-center">
          &quot;커뮤니티 검색&quot; 버튼을 눌러 이벤트 후보를 찾아보세요.
        </p>
      ) : null}
    </div>
  )
}
