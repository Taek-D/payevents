import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "카테고리별 간편결제 이벤트",
  description: "배달, 카페, 쇼핑, 편의점, 마트, 뷰티, 교통 등 카테고리별로 간편결제 할인 이벤트를 확인하세요.",
  openGraph: {
    title: "카테고리별 간편결제 이벤트",
    description: "배달, 카페, 쇼핑, 편의점, 마트, 뷰티, 교통 등 카테고리별로 간편결제 할인 이벤트를 확인하세요.",
    type: "website",
    images: [{ url: "/api/og?title=카테고리별+간편결제+이벤트", width: 1200, height: 630 }],
  },
}

export default function CategoriesPage() {
  return <div>카테고리</div>
}
