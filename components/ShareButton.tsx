"use client"

import { useState } from "react"
import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type ShareButtonProps = {
  title: string
  text: string
}

export function ShareButton({ title, text }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch {
        // User cancelled sharing
      }
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={handleShare}
      className="w-full gap-2 sm:w-auto"
    >
      <Share2 className="size-4" />
      {copied ? "링크 복사됨!" : "공유하기"}
    </Button>
  )
}
