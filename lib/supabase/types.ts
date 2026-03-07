// PayEvents Database Types
// Supabase 클라이언트 제네릭에 사용

type EventStatus = "draft" | "published" | "archived"
type SourceType = "official" | "community" | "submission" | "crawled"
type SubmissionStatus = "pending" | "approved" | "rejected"

// ============================================================
// Row 타입 (SELECT 결과)
// ============================================================

type PaymentProviderRow = {
  id: string
  code: string
  name_ko: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

type CategoryRow = {
  id: string
  slug: string
  name_ko: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

type BrandRow = {
  id: string
  slug: string
  name_ko: string
  normalized_name: string
  website_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

type EventRow = {
  id: string
  slug: string
  title: string
  summary: string | null
  payment_provider_id: string
  category_id: string
  brand_id: string
  benefit_text: string
  condition_text: string | null
  max_benefit_value: number | null
  stacking_possible: boolean
  start_date: string
  end_date: string
  is_online: boolean
  is_offline: boolean
  region_limit: string | null
  source_url: string | null
  source_type: SourceType
  is_verified: boolean
  status: EventStatus
  priority: number
  view_count: number
  published_at: string | null
  created_at: string
  updated_at: string
}

type NewsletterSubscriberRow = {
  id: string
  email: string
  is_active: boolean
  source: string
  subscribed_at: string
  unsubscribed_at: string | null
}

type EventSubmissionRow = {
  id: string
  submitter_name: string | null
  submitter_email: string | null
  payment_provider_code: string
  brand_name: string
  category_slug: string
  title: string
  summary: string | null
  benefit_text: string
  condition_text: string | null
  source_url: string | null
  screenshot_url: string | null
  start_date: string | null
  end_date: string | null
  status: SubmissionStatus
  admin_note: string | null
  approved_event_id: string | null
  created_at: string
  updated_at: string
}

// ============================================================
// Insert 타입 (INSERT용, id/timestamps 선택적)
// ============================================================

type PaymentProviderInsert = Omit<PaymentProviderRow, "id" | "created_at" | "updated_at"> & {
  id?: string
  created_at?: string
  updated_at?: string
}

type CategoryInsert = Omit<CategoryRow, "id" | "created_at" | "updated_at"> & {
  id?: string
  created_at?: string
  updated_at?: string
}

type BrandInsert = Omit<BrandRow, "id" | "created_at" | "updated_at"> & {
  id?: string
  created_at?: string
  updated_at?: string
}

type EventInsert = {
  id?: string
  slug: string
  title: string
  summary?: string | null
  payment_provider_id: string
  category_id: string
  brand_id: string
  benefit_text: string
  condition_text?: string | null
  max_benefit_value?: number | null
  stacking_possible?: boolean
  start_date: string
  end_date: string
  is_online?: boolean
  is_offline?: boolean
  region_limit?: string | null
  source_url?: string | null
  source_type?: SourceType
  is_verified?: boolean
  status?: EventStatus
  priority?: number
  view_count?: number
  published_at?: string | null
  created_at?: string
  updated_at?: string
}

type NewsletterSubscriberInsert = Omit<NewsletterSubscriberRow, "id" | "subscribed_at"> & {
  id?: string
  subscribed_at?: string
}

type EventSubmissionInsert = Omit<EventSubmissionRow, "id" | "status" | "admin_note" | "approved_event_id" | "created_at" | "updated_at"> & {
  id?: string
  status?: SubmissionStatus
  admin_note?: string | null
  approved_event_id?: string | null
  created_at?: string
  updated_at?: string
}

// ============================================================
// Update 타입 (UPDATE용, 모든 필드 선택적)
// ============================================================

type PaymentProviderUpdate = {
  code?: string
  name_ko?: string
  is_active?: boolean
  sort_order?: number
  updated_at?: string
}

type CategoryUpdate = {
  slug?: string
  name_ko?: string
  is_active?: boolean
  sort_order?: number
  updated_at?: string
}

type BrandUpdate = {
  slug?: string
  name_ko?: string
  normalized_name?: string
  website_url?: string | null
  is_active?: boolean
  updated_at?: string
}

type EventUpdate = {
  slug?: string
  title?: string
  summary?: string | null
  payment_provider_id?: string
  category_id?: string
  brand_id?: string
  benefit_text?: string
  condition_text?: string | null
  max_benefit_value?: number | null
  stacking_possible?: boolean
  start_date?: string
  end_date?: string
  is_online?: boolean
  is_offline?: boolean
  region_limit?: string | null
  source_url?: string | null
  source_type?: SourceType
  is_verified?: boolean
  status?: EventStatus
  priority?: number
  view_count?: number
  published_at?: string | null
  updated_at?: string
}

type NewsletterSubscriberUpdate = {
  email?: string
  is_active?: boolean
  source?: string
  unsubscribed_at?: string | null
}

type EventSubmissionUpdate = {
  submitter_name?: string | null
  submitter_email?: string | null
  payment_provider_code?: string
  brand_name?: string
  category_slug?: string
  title?: string
  summary?: string | null
  benefit_text?: string
  condition_text?: string | null
  source_url?: string | null
  screenshot_url?: string | null
  start_date?: string | null
  end_date?: string | null
  status?: SubmissionStatus
  admin_note?: string | null
  approved_event_id?: string | null
  updated_at?: string
}

// ============================================================
// Database 타입 (Supabase 클라이언트 제네릭)
// ============================================================

export type Database = {
  public: {
    Tables: {
      payment_providers: {
        Row: PaymentProviderRow
        Insert: PaymentProviderInsert
        Update: PaymentProviderUpdate
        Relationships: []
      }
      categories: {
        Row: CategoryRow
        Insert: CategoryInsert
        Update: CategoryUpdate
        Relationships: []
      }
      brands: {
        Row: BrandRow
        Insert: BrandInsert
        Update: BrandUpdate
        Relationships: []
      }
      events: {
        Row: EventRow
        Insert: EventInsert
        Update: EventUpdate
        Relationships: []
      }
      newsletter_subscribers: {
        Row: NewsletterSubscriberRow
        Insert: NewsletterSubscriberInsert
        Update: NewsletterSubscriberUpdate
        Relationships: []
      }
      event_submissions: {
        Row: EventSubmissionRow
        Insert: EventSubmissionInsert
        Update: EventSubmissionUpdate
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      event_status: EventStatus
      source_type: SourceType
      submission_status: SubmissionStatus
    }
    CompositeTypes: Record<string, never>
  }
}

// 편의 타입 export
export type {
  EventStatus,
  SourceType,
  SubmissionStatus,
  PaymentProviderRow,
  CategoryRow,
  BrandRow,
  EventRow,
  NewsletterSubscriberRow,
  EventSubmissionRow,
  PaymentProviderInsert,
  CategoryInsert,
  BrandInsert,
  EventInsert,
  NewsletterSubscriberInsert,
  EventSubmissionInsert,
  PaymentProviderUpdate,
  CategoryUpdate,
  BrandUpdate,
  EventUpdate,
  NewsletterSubscriberUpdate,
  EventSubmissionUpdate,
}
