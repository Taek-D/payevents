"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod/v4"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  email: z.email("유효한 이메일 주소를 입력해주세요"),
})

type FormValues = z.infer<typeof formSchema>

type NewsletterFormProps = {
  source?: string
  variant?: "inline" | "full"
}

export function NewsletterForm({
  source = "website",
  variant = "full",
}: NewsletterFormProps) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "already" | "error"
  >("idle")
  const [message, setMessage] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormValues) => {
    setStatus("loading")
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, source }),
      })
      const result = await res.json()

      if (result.success) {
        setStatus(result.already ? "already" : "success")
        setMessage(result.message)
      } else {
        setStatus("error")
        setMessage(result.message)
      }
    } catch {
      setStatus("error")
      setMessage("잠시 후 다시 시도해주세요")
    }
  }

  if (status === "success" || status === "already") {
    return (
      <div
        className={`flex items-center gap-2 ${variant === "inline" ? "justify-center" : "rounded-xl bg-green-50 px-5 py-4"}`}
      >
        <CheckCircle2
          className={`size-5 shrink-0 ${variant === "inline" ? "text-green-300" : "text-green-600"}`}
        />
        <div>
          <p
            className={`font-medium ${variant === "inline" ? "text-primary-foreground" : "text-green-800"}`}
          >
            {message}
          </p>
          {status === "success" && variant === "full" && (
            <p className="mt-1 text-sm text-green-600">
              다음 주 뉴스레터를 기대해주세요!
            </p>
          )}
        </div>
      </div>
    )
  }

  if (variant === "inline") {
    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-md gap-2"
      >
        <Input
          type="email"
          placeholder="이메일 주소 입력"
          className="h-10 bg-white/90 text-foreground placeholder:text-muted-foreground"
          {...register("email")}
        />
        <Button
          type="submit"
          variant="secondary"
          className="h-10 shrink-0 font-semibold"
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "구독"
          )}
        </Button>
        {(errors.email || status === "error") && (
          <p className="mt-1 text-xs text-red-300 sm:absolute sm:mt-12">
            {errors.email?.message ?? message}
          </p>
        )}
      </form>
    )
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <div className="flex-1">
          <Input
            type="email"
            placeholder="이메일 주소를 입력해주세요"
            className="h-11"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="size-3.5" />
              {errors.email.message}
            </p>
          )}
          {status === "error" && (
            <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="size-3.5" />
              {message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-11 shrink-0 gap-2 px-6 font-semibold"
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              처리 중...
            </>
          ) : (
            "무료 구독하기"
          )}
        </Button>
      </form>
      <p className="mt-3 text-xs text-muted-foreground">
        스팸 없음. 언제든지 수신 거부 가능.
      </p>
    </div>
  )
}
