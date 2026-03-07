import { Skeleton } from "@/components/ui/skeleton"

export default function EventDetailLoading() {
  return (
    <div className="mx-auto max-w-2xl">
      {/* Back + Badges */}
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-5 w-20" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>

      {/* Title */}
      <div className="mb-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="mt-2 h-5 w-1/2" />
      </div>

      {/* Benefit */}
      <div className="mb-6">
        <Skeleton className="mb-3 h-5 w-12" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>

      {/* Conditions */}
      <div className="mb-6">
        <Skeleton className="mb-3 h-5 w-12" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>

      {/* Period */}
      <div className="mb-6">
        <Skeleton className="mb-3 h-5 w-12" />
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Skeleton className="h-9 flex-1 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
    </div>
  )
}
