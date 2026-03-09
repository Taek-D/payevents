import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

/** Vercel Cron: 종료일이 지난 published 이벤트를 자동으로 archived 처리 */
export async function GET(request: NextRequest) {
  // Vercel Cron 또는 admin 인증 확인
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET
  const adminSecret = request.headers.get("x-admin-secret")

  const isAuthorized =
    (cronSecret && authHeader === `Bearer ${cronSecret}`) ||
    adminSecret === process.env.ADMIN_SECRET_KEY

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createAdminClient()
  const today = new Date().toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from("events")
    .update({ status: "archived" as const })
    .eq("status", "published")
    .lt("end_date", today)
    .select("id, title, end_date")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    message: `${data.length}건의 이벤트가 자동 종료 처리되었습니다`,
    archived: data,
    processedAt: new Date().toISOString(),
  })
}
