import { z } from "zod/v4"

export const eventCreateSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다"),
  summary: z.string().optional(),
  payment_provider_id: z.string().uuid("유효한 결제사 ID가 필요합니다"),
  category_id: z.string().uuid("유효한 카테고리 ID가 필요합니다"),
  brand_id: z.string().uuid("유효한 브랜드 ID가 필요합니다"),
  benefit_text: z.string().min(1, "혜택 내용은 필수입니다"),
  condition_text: z.string().optional(),
  max_benefit_value: z.number().int().positive().optional(),
  stacking_possible: z.boolean().default(false),
  start_date: z.string().date("유효한 날짜 형식이 필요합니다 (YYYY-MM-DD)"),
  end_date: z.string().date("유효한 날짜 형식이 필요합니다 (YYYY-MM-DD)"),
  is_online: z.boolean().default(true),
  is_offline: z.boolean().default(false),
  region_limit: z.string().optional(),
  source_url: z.string().url("유효한 URL이 필요합니다").optional(),
  source_type: z.enum(["official", "community", "submission", "crawled"]).default("official"),
  is_verified: z.boolean().default(false),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  priority: z.number().int().default(0),
})

export const eventUpdateSchema = eventCreateSchema.partial().extend({
  id: z.string().uuid("유효한 이벤트 ID가 필요합니다"),
})

export const eventPublishSchema = z.object({
  status: z.enum(["draft", "published", "archived"]),
})

export type EventCreateInput = z.infer<typeof eventCreateSchema>
export type EventUpdateInput = z.infer<typeof eventUpdateSchema>
