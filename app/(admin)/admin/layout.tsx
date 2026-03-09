import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const session = cookieStore.get("admin_session")?.value

  if (!session || session !== process.env.ADMIN_SECRET_KEY) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <Link
                href="/admin"
                className="text-sm font-bold text-gray-900 hover:text-gray-700"
              >
                PayEvents Admin
              </Link>
              <div className="flex items-center gap-4">
                <Link
                  href="/admin"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  대시보드
                </Link>
                <Link
                  href="/admin/submissions"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  제보 검수
                </Link>
                <Link
                  href="/admin/events"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  이벤트 관리
                </Link>
              </div>
            </div>
            <Link
              href="/api/admin/logout"
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              로그아웃
            </Link>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
