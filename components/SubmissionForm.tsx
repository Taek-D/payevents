"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PROVIDERS } from "@/lib/constants/providers"
import {
  submissionSchema,
  type SubmissionInput,
} from "@/lib/validations/submission"
import { SubmissionSuccess } from "@/components/SubmissionSuccess"

export function SubmissionForm() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle")
  const [showOptional, setShowOptional] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmissionInput>({
    resolver: zodResolver(submissionSchema),
  })

  const onSubmit = async (data: SubmissionInput) => {
    setStatus("loading")
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await res.json()

      if (result.success) {
        setStatus("success")
      } else {
        setStatus("error")
        setErrorMessage(result.message)
      }
    } catch {
      setStatus("error")
      setErrorMessage("잠시 후 다시 시도해주세요")
    }
  }

  const handleReset = () => {
    reset()
    setStatus("idle")
    setShowOptional(false)
    setErrorMessage("")
  }

  if (status === "success") {
    return <SubmissionSuccess onReset={handleReset} />
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label
          htmlFor="paymentProviderCode"
          className="mb-1.5 block text-sm font-medium"
        >
          결제사 <span className="text-red-500">*</span>
        </label>
        <select
          id="paymentProviderCode"
          className="flex h-11 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
          defaultValue=""
          {...register("paymentProviderCode")}
        >
          <option value="" disabled>
            결제사를 선택해주세요
          </option>
          {PROVIDERS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        {errors.paymentProviderCode && (
          <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">
            <AlertCircle className="size-3.5" />
            결제사를 선택해주세요
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="sourceUrl"
          className="mb-1.5 block text-sm font-medium"
        >
          이벤트 원문 링크 <span className="text-red-500">*</span>
        </label>
        <Input
          id="sourceUrl"
          type="url"
          placeholder="https://..."
          className="h-11"
          {...register("sourceUrl")}
        />
        {errors.sourceUrl && (
          <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">
            <AlertCircle className="size-3.5" />
            {errors.sourceUrl.message}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => setShowOptional(!showOptional)}
        className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        {showOptional ? (
          <ChevronUp className="size-4" />
        ) : (
          <ChevronDown className="size-4" />
        )}
        더 많은 정보 입력하기
      </button>

      {showOptional && (
        <div className="space-y-4 rounded-xl border border-border p-4">
          <div>
            <label
              htmlFor="brandName"
              className="mb-1.5 block text-sm font-medium"
            >
              브랜드명
            </label>
            <Input
              id="brandName"
              placeholder="예: 스타벅스"
              className="h-10"
              {...register("brandName")}
            />
          </div>

          <div>
            <label
              htmlFor="benefitText"
              className="mb-1.5 block text-sm font-medium"
            >
              혜택 내용
            </label>
            <textarea
              id="benefitText"
              placeholder="예: 10% 할인, 최대 2,000원 캐시백"
              className="flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              {...register("benefitText")}
            />
          </div>

          <div>
            <label
              htmlFor="conditionText"
              className="mb-1.5 block text-sm font-medium"
            >
              이용 조건
            </label>
            <textarea
              id="conditionText"
              placeholder="예: 1만원 이상 결제 시 적용"
              className="flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              {...register("conditionText")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="startDate"
                className="mb-1.5 block text-sm font-medium"
              >
                시작일
              </label>
              <Input
                id="startDate"
                type="date"
                className="h-10"
                {...register("startDate")}
              />
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="mb-1.5 block text-sm font-medium"
              >
                종료일
              </label>
              <Input
                id="endDate"
                type="date"
                className="h-10"
                {...register("endDate")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="submitterName"
                className="mb-1.5 block text-sm font-medium"
              >
                제보자 이름
              </label>
              <Input
                id="submitterName"
                placeholder="(선택)"
                className="h-10"
                {...register("submitterName")}
              />
            </div>
            <div>
              <label
                htmlFor="submitterEmail"
                className="mb-1.5 block text-sm font-medium"
              >
                제보자 이메일
              </label>
              <Input
                id="submitterEmail"
                type="email"
                placeholder="(선택)"
                className="h-10"
                {...register("submitterEmail")}
              />
              {errors.submitterEmail && (
                <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="size-3.5" />
                  {errors.submitterEmail.message}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {status === "error" && (
        <p className="flex items-center gap-1 text-sm text-red-500">
          <AlertCircle className="size-3.5" />
          {errorMessage}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="h-11 w-full gap-2 font-semibold"
        disabled={status === "loading"}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            제출 중...
          </>
        ) : (
          "제보하기"
        )}
      </Button>
    </form>
  )
}
