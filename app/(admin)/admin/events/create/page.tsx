"use client"

import { EventForm } from "@/components/admin/EventForm"

export default function CreateEventPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-xl font-bold text-gray-900">이벤트 등록</h1>
      <EventForm mode="create" />
    </div>
  )
}
