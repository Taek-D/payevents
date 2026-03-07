import { z } from "zod/v4"

export const submissionSchema = z.object({
  sourceUrl: z.url("유효한 원문 링크를 입력해주세요"),
  paymentProviderCode: z.enum(["NAVERPAY", "TOSSPAY", "KAKAOPAY", "PAYCO"], {
    message: "결제사를 선택해주세요",
  }),
  brandName: z.string().optional(),
  categorySlug: z.string().optional(),
  title: z.string().optional(),
  benefitText: z.string().optional(),
  conditionText: z.string().optional(),
  startDate: z
    .union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal("")])
    .optional(),
  endDate: z
    .union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal("")])
    .optional(),
  submitterName: z.string().optional(),
  submitterEmail: z
    .union([z.email("유효한 이메일 주소를 입력해주세요"), z.literal("")])
    .optional(),
})

export type SubmissionInput = z.infer<typeof submissionSchema>
