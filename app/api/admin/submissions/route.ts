import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { verifyAdmin } from "@/lib/admin/auth"
import type { SubmissionStatus } from "@/lib/supabase/types"

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createAdminClient()
  const { searchParams } = request.nextUrl
  const status = (searchParams.get("status") ?? "pending") as SubmissionStatus

  const { data, error } = await supabase
    .from("event_submissions")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: data ?? [] })
}
