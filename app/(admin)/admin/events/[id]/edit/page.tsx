import { notFound } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/admin"
import { EventForm } from "@/components/admin/EventForm"
import { EventStatusButtons } from "@/components/admin/EventStatusButtons"
import { DeleteEventDialog } from "@/components/admin/DeleteEventDialog"

export const revalidate = 0

const EVENT_SELECT = `
  *,
  payment_provider:payment_providers(id, code, name_ko),
  category:categories(id, slug, name_ko),
  brand:brands(id, slug, name_ko)
` as const

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("events")
    .select(EVENT_SELECT)
    .eq("id", id)
    .single()

  if (error || !data) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-xl font-bold text-gray-900">이벤트 수정</h1>
      <EventStatusButtons eventId={id} currentStatus={data.status} />
      <EventForm
        mode="edit"
        eventId={id}
        initialData={{
          title: data.title,
          summary: data.summary,
          payment_provider_id: data.payment_provider_id,
          category_id: data.category_id,
          brand_id: data.brand_id,
          benefit_text: data.benefit_text,
          condition_text: data.condition_text,
          start_date: data.start_date,
          end_date: data.end_date,
          is_online: data.is_online,
          is_offline: data.is_offline,
          image_url: data.image_url,
          source_url: data.source_url,
          source_type: data.source_type,
          status: data.status,
        }}
      />
      <div className="border-t border-gray-200 pt-4">
        <DeleteEventDialog eventId={id} eventTitle={data.title} />
      </div>
    </div>
  )
}
