"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { adminFetch } from "@/lib/admin/api"

export function PublishButton({ eventId }: { eventId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handlePublish() {
    if (!confirm("이 이벤트를 게시하시겠습니까?")) return
    setLoading(true)

    try {
      const res = await adminFetch("/api/admin/events", {
        method: "PUT",
        body: JSON.stringify({
          id: eventId,
          status: "published",
        }),
      })

      if (res.ok) {
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePublish}
      disabled={loading}
      className="text-xs text-green-600 hover:text-green-800 hover:underline disabled:opacity-50"
    >
      {loading ? "게시중..." : "게시"}
    </button>
  )
}
