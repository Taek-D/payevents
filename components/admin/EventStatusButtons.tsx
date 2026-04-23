"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { adminFetch } from "@/lib/admin/api"
import type { EventStatus } from "@/lib/supabase/types"

type Props = { eventId: string; currentStatus: EventStatus }

const STATUS_OPTIONS: { value: EventStatus; label: string; activeClass: string }[] = [
  { value: "draft", label: "임시저장", activeClass: "bg-gray-600 text-white" },
  { value: "published", label: "게시중", activeClass: "bg-green-600 text-white" },
  { value: "archived", label: "보관", activeClass: "bg-yellow-600 text-white" },
]

export function EventStatusButtons({ eventId, currentStatus }: Props) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function changeStatus(status: EventStatus) {
    if (status === currentStatus || pending) return
    setPending(true)
    try {
      const res = await adminFetch(`/api/admin/events/${eventId}/publish`, {
        method: "POST",
        body: JSON.stringify({ status }),
      })
      if (res.ok) router.refresh()
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="text-xs font-medium text-gray-700 mb-2">게시 상태</div>
      <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            disabled={pending}
            onClick={() => changeStatus(opt.value)}
            className={[
              "px-4 py-2 text-sm font-medium transition-colors",
              currentStatus === opt.value
                ? opt.activeClass
                : "bg-white text-gray-600 hover:bg-gray-50",
            ].join(" ")}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
