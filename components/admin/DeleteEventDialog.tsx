"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { adminFetch } from "@/lib/admin/api"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

type Props = { eventId: string; eventTitle: string }

export function DeleteEventDialog({ eventId, eventTitle }: Props) {
  const router = useRouter()
  const [confirmText, setConfirmText] = useState("")
  const [deleting, setDeleting] = useState(false)
  const canDelete = confirmText === eventTitle && !deleting

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await adminFetch(`/api/admin/events/${eventId}`, {
        method: "DELETE",
      })
      if (res.ok) router.push("/admin/events")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <button
            type="button"
            className="text-sm text-red-600 hover:text-red-700 hover:underline"
          >
            이벤트 완전 삭제
          </button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정말 완전 삭제하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            이 작업은 되돌릴 수 없습니다. 확인을 위해 이벤트 제목을 그대로 입력해주세요:
            <span className="block mt-2 font-mono text-xs text-gray-700">
              {eventTitle}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="이벤트 제목을 그대로 입력"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            disabled={!canDelete}
            onClick={handleDelete}
            className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? "삭제 중..." : "완전 삭제"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
