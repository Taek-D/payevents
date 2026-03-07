import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const EVENT_SELECT = `
  *,
  payment_provider:payment_providers(id, code, name_ko),
  category:categories(id, slug, name_ko),
  brand:brands(id, slug, name_ko)
` as const

export async function GET() {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]

  const threeDaysLater = new Date()
  threeDaysLater.setDate(threeDaysLater.getDate() + 3)
  const thresholdDate = threeDaysLater.toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("events")
    .select(EVENT_SELECT)
    .eq("status", "published" as const)
    .gte("end_date", today)
    .lte("end_date", thresholdDate)
    .order("end_date", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: data ?? [] })
}
