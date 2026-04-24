"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PROVIDERS } from "@/lib/constants/providers"
import { CATEGORIES } from "@/lib/constants/categories"
import type { EventFiltersState } from "@/lib/types/event"

export type EventFiltersProps = {
  currentFilters: EventFiltersState
  onFilterChange: (filters: Partial<EventFiltersState>) => void
}

export function EventFilters({ currentFilters, onFilterChange }: EventFiltersProps) {
  return (
    <div className="space-y-4">
      {/* 결제사 필터 */}
      <div>
        <h4 className="mb-2 text-sm font-medium text-muted-foreground">결제사</h4>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none sm:flex-wrap sm:overflow-visible">
          <Button
            variant={currentFilters.provider === "" ? "default" : "outline"}
            size="sm"
            className="shrink-0"
            onClick={() => onFilterChange({ provider: "", page: 1 })}
          >
            전체
          </Button>
          {PROVIDERS.map((p) => (
            <Button
              key={p.value}
              variant={currentFilters.provider === p.value ? "default" : "outline"}
              size="sm"
              className="shrink-0"
              onClick={() => onFilterChange({ provider: p.value, page: 1 })}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div>
        <h4 className="mb-2 text-sm font-medium text-muted-foreground">카테고리</h4>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none sm:flex-wrap sm:overflow-visible">
          <Button
            variant={currentFilters.category === "" ? "default" : "outline"}
            size="sm"
            className="shrink-0"
            onClick={() => onFilterChange({ category: "", page: 1 })}
          >
            전체
          </Button>
          {CATEGORIES.map((c) => (
            <Button
              key={c.value}
              variant={currentFilters.category === c.value ? "default" : "outline"}
              size="sm"
              className="shrink-0"
              onClick={() => onFilterChange({ category: c.value, page: 1 })}
            >
              {c.label}
            </Button>
          ))}
        </div>
      </div>

      {/* 정렬 */}
      <div>
        <Select
          value={currentFilters.sort}
          onValueChange={(value) =>
            onFilterChange({ sort: value as EventFiltersState["sort"], page: 1 })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">최신순</SelectItem>
            <SelectItem value="ending_soon">종료임박순</SelectItem>
            <SelectItem value="popular">인기순</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
