import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

function verifyAdmin(request: NextRequest): boolean {
  const secret = request.headers.get("x-admin-secret")
  return secret === process.env.ADMIN_SECRET_KEY
}

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createAdminClient()

  const [providerRes, categoryRes, brandRes] = await Promise.all([
    supabase.from("payment_providers").select("id, code, name_ko").order("name_ko"),
    supabase.from("categories").select("id, slug, name_ko").order("name_ko"),
    supabase.from("brands").select("id, slug, name_ko").order("name_ko"),
  ])

  return NextResponse.json({
    data: {
      providers: providerRes.data ?? [],
      categories: categoryRes.data ?? [],
      brands: brandRes.data ?? [],
    },
  })
}
