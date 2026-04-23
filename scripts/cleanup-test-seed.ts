/**
 * Cleanup script: PayEvents 테스트 시드 데이터 완전 삭제
 *
 * 식별자: slug LIKE '%-202603' (모든 시드 행은 startDate=2026-03 → slug suffix `-202603`)
 * 실데이터(2026-04 이후) slug 는 `-202604`+ 이므로 절대 매칭되지 않음.
 *
 * 실행:
 *   cd payevents && npx tsx scripts/cleanup-test-seed.ts
 *
 * 환경변수 필요:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Phase 3 ADMIN-02 / D-09. 1회성 정리 후 보관 (재발 방지용 idempotent — 두 번 실행해도 안전).
 */
import { createClient } from "@supabase/supabase-js"

const SEED_SLUG_PATTERN = "%-202603"

function getEnv(key: string): string {
  const v = process.env[key]
  if (!v) {
    throw new Error(`Missing required env var: ${key}`)
  }
  return v
}

async function main() {
  const supabase = createClient(
    getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getEnv("SUPABASE_SERVICE_ROLE_KEY"),
  )

  // 1. 사전 카운트
  const { count: beforeCount, error: countErr } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .like("slug", SEED_SLUG_PATTERN)

  if (countErr) throw countErr

  process.stderr.write(`[cleanup] before: ${beforeCount ?? 0} test seed events match slug LIKE '${SEED_SLUG_PATTERN}'\n`)

  if (!beforeCount || beforeCount === 0) {
    process.stderr.write("[cleanup] nothing to delete. exiting.\n")
    return
  }

  // 2. 시드 이벤트 ID 목록 조회 (FK 안전용)
  const { data: ids, error: idsErr } = await supabase
    .from("events")
    .select("id")
    .like("slug", SEED_SLUG_PATTERN)

  if (idsErr) throw idsErr
  const idList = (ids ?? []).map((r) => r.id)

  // 3. event_submissions.approved_event_id null 처리 (FK ON DELETE 룰 없음 — 명시 처리)
  if (idList.length > 0) {
    const { error: nullErr } = await supabase
      .from("event_submissions")
      .update({ approved_event_id: null })
      .in("approved_event_id", idList)

    if (nullErr) throw nullErr
    process.stderr.write(`[cleanup] nulled approved_event_id references for ${idList.length} ids\n`)
  }

  // 4. events DELETE
  const { error: delErr } = await supabase
    .from("events")
    .delete()
    .like("slug", SEED_SLUG_PATTERN)

  if (delErr) throw delErr

  // 5. 사후 카운트 검증
  const { count: afterCount, error: afterErr } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .like("slug", SEED_SLUG_PATTERN)

  if (afterErr) throw afterErr

  process.stderr.write(`[cleanup] after: ${afterCount ?? 0} (expected: 0)\n`)

  if ((afterCount ?? 0) !== 0) {
    throw new Error(`Cleanup incomplete: ${afterCount} rows still match`)
  }

  process.stderr.write("[cleanup] complete.\n")
}

main().catch((e) => {
  process.stderr.write(`[cleanup] failed: ${e instanceof Error ? e.message : String(e)}\n`)
  process.exit(1)
})
