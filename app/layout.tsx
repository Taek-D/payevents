import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "PayEvents — 간편결제 이벤트 허브",
    template: "%s | PayEvents",
  },
  description:
    "오늘 뭐 쓰면 이득일까? 네이버페이·토스페이·카카오페이·페이코 이벤트를 한곳에서 확인하세요",
  keywords: [
    "간편결제",
    "이벤트",
    "네이버페이",
    "토스페이",
    "카카오페이",
    "페이코",
    "할인",
    "적립",
    "혜택",
  ],
  openGraph: {
    title: "PayEvents — 간편결제 이벤트 허브",
    description:
      "오늘 뭐 쓰면 이득일까? 네이버페이·토스페이·카카오페이·페이코 이벤트를 한곳에서 확인하세요",
    type: "website",
    siteName: "PayEvents",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
