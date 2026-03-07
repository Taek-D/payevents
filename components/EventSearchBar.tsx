"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type EventSearchBarProps = {
  onSearch: (query: string) => void
  initialValue?: string
}

export function EventSearchBar({ onSearch, initialValue = "" }: EventSearchBarProps) {
  const [value, setValue] = useState(initialValue)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const debouncedSearch = useCallback(
    (query: string) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => onSearch(query), 300)
    },
    [onSearch]
  )

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    debouncedSearch(newValue)
  }

  const handleClear = () => {
    setValue("")
    onSearch("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (timerRef.current) clearTimeout(timerRef.current)
      onSearch(value)
    }
  }

  return (
    <div className="relative flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="이벤트 검색..."
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="pl-9 pr-9"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button
        size="icon"
        variant="outline"
        onClick={() => {
          if (timerRef.current) clearTimeout(timerRef.current)
          onSearch(value)
        }}
        aria-label="검색"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  )
}
