import Link from "next/link"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 h-14">
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
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
