import { randomUUID } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { submissionSchema } from "@/lib/validations/submission"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = submissionSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.issues[0].message },
        { status: 400 }
      )
    }

    const data = result.data
    const supabase = await createClient()

    // sourceUrl 중복 체크
    let duplicateWarning: string | null = null
    const { data: existing } = await supabase
      .from("event_submissions")
      .select("id")
      .eq("source_url", data.sourceUrl)
      .in("status", ["pending", "approved"])
      .limit(1)

    if (existing && existing.length > 0) {
      duplicateWarning =
        "동일한 URL의 제보가 이미 접수되어 있어요. 중복 제보일 수 있습니다."
    }

    const submissionId = randomUUID()

    const { error } = await supabase
      .from("event_submissions")
      .insert({
        id: submissionId,
        source_url: data.sourceUrl,
        payment_provider_code: data.paymentProviderCode,
        brand_name: data.brandName || "",
        category_slug: data.categorySlug || "",
        title: data.title || "",
        benefit_text: data.benefitText || "",
        condition_text: data.conditionText || null,
        start_date: data.startDate || null,
        end_date: data.endDate || null,
        submitter_name: data.submitterName || null,
        submitter_email: data.submitterEmail || null,
      })

    if (error) {
      return NextResponse.json(
        { success: false, message: "제보 접수 중 오류가 발생했습니다" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      submissionId,
      message: duplicateWarning || "제보가 접수되었어요!",
      duplicate: !!duplicateWarning,
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "요청을 처리할 수 없습니다" },
      { status: 400 }
    )
  }
}
