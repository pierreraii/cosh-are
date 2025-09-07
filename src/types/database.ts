// =============================================================================
// DATABASE TYPES FOR COLLECTIVE ASSETS
// =============================================================================
// Auto-generated TypeScript types matching the Supabase schema

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      items: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string
          total_value: number
          purchase_date: string | null
          location: string | null
          status: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category: string
          total_value?: number
          purchase_date?: string | null
          location?: string | null
          status?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: string
          total_value?: number
          purchase_date?: string | null
          location?: string | null
          status?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      item_owners: {
        Row: {
          id: string
          item_id: string
          user_id: string
          ownership_percentage: number
          role: string
          joined_at: string
        }
        Insert: {
          id?: string
          item_id: string
          user_id: string
          ownership_percentage: number
          role?: string
          joined_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          user_id?: string
          ownership_percentage?: number
          role?: string
          joined_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          item_id: string
          title: string
          description: string | null
          document_type: string
          file_url: string | null
          file_name: string | null
          file_size: number | null
          mime_type: string | null
          uploaded_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          item_id: string
          title: string
          description?: string | null
          document_type: string
          file_url?: string | null
          file_name?: string | null
          file_size?: number | null
          mime_type?: string | null
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          title?: string
          description?: string | null
          document_type?: string
          file_url?: string | null
          file_name?: string | null
          file_size?: number | null
          mime_type?: string | null
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          item_id: string
          booked_by: string
          title: string
          description: string | null
          start_date: string
          end_date: string
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          item_id: string
          booked_by: string
          title: string
          description?: string | null
          start_date: string
          end_date: string
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          booked_by?: string
          title?: string
          description?: string | null
          start_date?: string
          end_date?: string
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          item_id: string
          title: string
          description: string | null
          amount: number
          expense_type: string
          expense_date: string
          is_recurring: boolean
          recurring_period: string | null
          next_due_date: string | null
          paid_by: string | null
          split_method: string
          receipt_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          item_id: string
          title: string
          description?: string | null
          amount: number
          expense_type: string
          expense_date?: string
          is_recurring?: boolean
          recurring_period?: string | null
          next_due_date?: string | null
          paid_by?: string | null
          split_method?: string
          receipt_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          title?: string
          description?: string | null
          amount?: number
          expense_type?: string
          expense_date?: string
          is_recurring?: boolean
          recurring_period?: string | null
          next_due_date?: string | null
          paid_by?: string | null
          split_method?: string
          receipt_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      expense_splits: {
        Row: {
          id: string
          expense_id: string
          user_id: string
          amount_owed: number
          amount_paid: number
          paid_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          expense_id: string
          user_id: string
          amount_owed: number
          amount_paid?: number
          paid_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          expense_id?: string
          user_id?: string
          amount_owed?: number
          amount_paid?: number
          paid_at?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          related_id: string | null
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: string
          related_id?: string | null
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          related_id?: string | null
          read?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// =============================================================================
// HELPER TYPES
// =============================================================================

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Item = Database['public']['Tables']['items']['Row']
export type ItemOwner = Database['public']['Tables']['item_owners']['Row']
export type Document = Database['public']['Tables']['documents']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type Expense = Database['public']['Tables']['expenses']['Row']
export type ExpenseSplit = Database['public']['Tables']['expense_splits']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']

// Insert types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ItemInsert = Database['public']['Tables']['items']['Insert']
export type ItemOwnerInsert = Database['public']['Tables']['item_owners']['Insert']
export type DocumentInsert = Database['public']['Tables']['documents']['Insert']
export type BookingInsert = Database['public']['Tables']['bookings']['Insert']
export type ExpenseInsert = Database['public']['Tables']['expenses']['Insert']
export type ExpenseSplitInsert = Database['public']['Tables']['expense_splits']['Insert']
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert']

// Update types
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type ItemUpdate = Database['public']['Tables']['items']['Update']
export type ItemOwnerUpdate = Database['public']['Tables']['item_owners']['Update']
export type DocumentUpdate = Database['public']['Tables']['documents']['Update']
export type BookingUpdate = Database['public']['Tables']['bookings']['Update']
export type ExpenseUpdate = Database['public']['Tables']['expenses']['Update']
export type ExpenseSplitUpdate = Database['public']['Tables']['expense_splits']['Update']
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update']

// =============================================================================
// EXTENDED TYPES WITH RELATIONSHIPS
// =============================================================================

export interface ItemWithOwners extends Item {
  owners: Array<ItemOwner & { profile: Profile }>
}

export interface ItemWithDetails extends Item {
  owners: Array<ItemOwner & { profile: Profile }>
  documents: Document[]
  bookings: Booking[]
  expenses: Expense[]
}

export interface BookingWithDetails extends Booking {
  item: Item
  booker: Profile
}

export interface ExpenseWithDetails extends Expense {
  item: Item
  paid_by_profile: Profile | null
  splits: Array<ExpenseSplit & { profile: Profile }>
}

export interface DocumentWithDetails extends Document {
  item: Item
  uploader: Profile | null
}

// =============================================================================
// ENUMS AND CONSTANTS
// =============================================================================

export const ITEM_CATEGORIES = [
  'property',
  'vehicle', 
  'equipment',
  'furniture',
  'electronics',
  'other'
] as const

export const ITEM_STATUS = [
  'active',
  'sold',
  'disposed',
  'maintenance'
] as const

export const EXPENSE_TYPES = [
  'maintenance',
  'utilities',
  'insurance',
  'tax',
  'fuel',
  'parking',
  'other'
] as const

export const DOCUMENT_TYPES = [
  'contract',
  'receipt', 
  'manual',
  'photo',
  'insurance',
  'registration',
  'other'
] as const

export const BOOKING_STATUS = [
  'pending',
  'confirmed', 
  'cancelled',
  'completed'
] as const

export const NOTIFICATION_TYPES = [
  'booking',
  'expense',
  'payment',
  'system'
] as const

export const OWNERSHIP_ROLES = [
  'owner',
  'co-owner', 
  'manager'
] as const

export const SPLIT_METHODS = [
  'equal',
  'by_ownership',
  'custom'
] as const

export const RECURRING_PERIODS = [
  'monthly',
  'quarterly', 
  'annually'
] as const

export type ItemCategory = typeof ITEM_CATEGORIES[number]
export type ItemStatus = typeof ITEM_STATUS[number]
export type ExpenseType = typeof EXPENSE_TYPES[number]
export type DocumentType = typeof DOCUMENT_TYPES[number]
export type BookingStatus = typeof BOOKING_STATUS[number]
export type NotificationType = typeof NOTIFICATION_TYPES[number]
export type OwnershipRole = typeof OWNERSHIP_ROLES[number]
export type SplitMethod = typeof SPLIT_METHODS[number]
export type RecurringPeriod = typeof RECURRING_PERIODS[number]