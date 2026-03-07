import { z } from "zod/v4"

export const subscribeSchema = z.object({
  email: z.email("유효한 이메일 주소를 입력해주세요"),
  source: z.string().default("website"),
})

export type SubscribeInput = z.infer<typeof subscribeSchema>
