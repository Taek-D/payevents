"use client"

import { Mail } from "lucide-react"
import { NewsletterForm } from "@/components/NewsletterForm"

export function NewsletterBanner() {
  return (
    <section className="relative rounded-2xl bg-primary px-6 py-8 text-center text-primary-foreground sm:px-12 sm:py-10">
      <Mail className="mx-auto size-8 opacity-80" />
      <h2 className="mt-3 text-lg font-bold sm:text-xl">
        매주 간편결제 혜택 정리, 메일로 받기
      </h2>
      <p className="mt-2 text-sm opacity-80">
        놓치기 아까운 이벤트만 골라서 보내드려요
      </p>
      <div className="mt-5">
        <NewsletterForm source="home_banner" variant="inline" />
      </div>
    </section>
  )
}
