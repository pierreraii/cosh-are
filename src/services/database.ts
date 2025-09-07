// =============================================================================
// DATABASE SERVICES FOR COLLECTIVE ASSETS
// =============================================================================
// Service functions to interact with the Supabase database

import { supabase } from '@/lib/supabase'
import { 
  Profile, ProfileInsert, ProfileUpdate,
  Item, ItemInsert, ItemUpdate, ItemWithOwners, ItemWithDetails,
  ItemOwner, ItemOwnerInsert, ItemOwnerUpdate,
  Document, DocumentInsert, DocumentUpdate,
  Booking, BookingInsert, BookingUpdate, BookingWithDetails,
  Expense, ExpenseInsert, ExpenseUpdate, ExpenseWithDetails,
  ExpenseSplit, ExpenseSplitInsert,
  Notification, NotificationInsert
} from '@/types/database'

// =============================================================================
// PROFILE SERVICES
// =============================================================================

export const profileService = {
  async getCurrentProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    return data
  },

  async updateProfile(id: string, updates: ProfileUpdate): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      return null
    }

    return data
  },

  async getProfile(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    return data
  }
}

// =============================================================================
// ITEM SERVICES
// =============================================================================

export const itemService = {
  async getUserItems(): Promise<ItemWithOwners[]> {
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        owners:item_owners(
          *,
          profile:profiles(*)
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user items:', error)
      return []
    }

    return data as ItemWithOwners[]
  },

  async getItemDetails(itemId: string): Promise<ItemWithDetails | null> {
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        owners:item_owners(
          *,
          profile:profiles(*)
        ),
        documents(*),
        bookings(*),
        expenses(*)
      `)
      .eq('id', itemId)
      .single()

    if (error) {
      console.error('Error fetching item details:', error)
      return null
    }

    return data as ItemWithDetails
  },

  async createItem(itemData: ItemInsert): Promise<Item | null> {
    const { data, error } = await supabase
      .from('items')
      .insert(itemData)
      .select()
      .single()

    if (error) {
      console.error('Error creating item:', error)
      return null
    }

    return data
  },

  async updateItem(id: string, updates: ItemUpdate): Promise<Item | null> {
    const { data, error } = await supabase
      .from('items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating item:', error)
      return null
    }

    return data
  },

  async deleteItem(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting item:', error)
      return false
    }

    return true
  }
}

// =============================================================================
// ITEM OWNERSHIP SERVICES
// =============================================================================

export const ownershipService = {
  async addOwner(ownerData: ItemOwnerInsert): Promise<ItemOwner | null> {
    const { data, error } = await supabase
      .from('item_owners')
      .insert(ownerData)
      .select()
      .single()

    if (error) {
      console.error('Error adding owner:', error)
      return null
    }

    return data
  },

  async updateOwnership(id: string, updates: ItemOwnerUpdate): Promise<ItemOwner | null> {
    const { data, error } = await supabase
      .from('item_owners')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating ownership:', error)
      return null
    }

    return data
  },

  async removeOwner(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('item_owners')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error removing owner:', error)
      return false
    }

    return true
  }
}

// =============================================================================
// DOCUMENT SERVICES
// =============================================================================

export const documentService = {
  async getItemDocuments(itemId: string): Promise<Document[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('item_id', itemId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching documents:', error)
      return []
    }

    return data
  },

  async uploadDocument(documentData: DocumentInsert): Promise<Document | null> {
    const { data, error } = await supabase
      .from('documents')
      .insert(documentData)
      .select()
      .single()

    if (error) {
      console.error('Error uploading document:', error)
      return null
    }

    return data
  },

  async deleteDocument(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting document:', error)
      return false
    }

    return true
  }
}

// =============================================================================
// BOOKING SERVICES
// =============================================================================

export const bookingService = {
  async getItemBookings(itemId: string): Promise<BookingWithDetails[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        item:items(*),
        booker:profiles(*)
      `)
      .eq('item_id', itemId)
      .order('start_date', { ascending: true })

    if (error) {
      console.error('Error fetching bookings:', error)
      return []
    }

    return data as BookingWithDetails[]
  },

  async getUserBookings(): Promise<BookingWithDetails[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        item:items(*),
        booker:profiles(*)
      `)
      .order('start_date', { ascending: true })

    if (error) {
      console.error('Error fetching user bookings:', error)
      return []
    }

    return data as BookingWithDetails[]
  },

  async createBooking(bookingData: BookingInsert): Promise<Booking | null> {
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single()

    if (error) {
      console.error('Error creating booking:', error)
      return null
    }

    return data
  },

  async updateBooking(id: string, updates: BookingUpdate): Promise<Booking | null> {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating booking:', error)
      return null
    }

    return data
  },

  async deleteBooking(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting booking:', error)
      return false
    }

    return true
  }
}

// =============================================================================
// EXPENSE SERVICES
// =============================================================================

export const expenseService = {
  async getItemExpenses(itemId: string): Promise<ExpenseWithDetails[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        item:items(*),
        paid_by_profile:profiles(*),
        splits:expense_splits(
          *,
          profile:profiles(*)
        )
      `)
      .eq('item_id', itemId)
      .order('expense_date', { ascending: false })

    if (error) {
      console.error('Error fetching expenses:', error)
      return []
    }

    return data as ExpenseWithDetails[]
  },

  async createExpense(expenseData: ExpenseInsert): Promise<Expense | null> {
    const { data, error } = await supabase
      .from('expenses')
      .insert(expenseData)
      .select()
      .single()

    if (error) {
      console.error('Error creating expense:', error)
      return null
    }

    // Create expense splits
    if (data && expenseData.split_method !== 'custom') {
      await supabase.rpc('create_expense_splits', { expense_id: data.id })
    }

    return data
  },

  async updateExpense(id: string, updates: ExpenseUpdate): Promise<Expense | null> {
    const { data, error } = await supabase
      .from('expenses')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating expense:', error)
      return null
    }

    return data
  },

  async markSplitPaid(splitId: string, amount: number): Promise<boolean> {
    const { error } = await supabase
      .from('expense_splits')
      .update({ 
        amount_paid: amount, 
        paid_at: new Date().toISOString() 
      })
      .eq('id', splitId)

    if (error) {
      console.error('Error marking split as paid:', error)
      return false
    }

    return true
  }
}

// =============================================================================
// NOTIFICATION SERVICES
// =============================================================================

export const notificationService = {
  async getUserNotifications(): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching notifications:', error)
      return []
    }

    return data
  },

  async markNotificationRead(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)

    if (error) {
      console.error('Error marking notification as read:', error)
      return false
    }

    return true
  },

  async createNotification(notificationData: NotificationInsert): Promise<Notification | null> {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
      .single()

    if (error) {
      console.error('Error creating notification:', error)
      return null
    }

    return data
  }
}

// =============================================================================
// DASHBOARD SERVICES
// =============================================================================

export const dashboardService = {
  async getDashboardStats() {
    const [items, expenses, bookings] = await Promise.all([
      itemService.getUserItems(),
      this.getRecentExpenses(),
      this.getUpcomingBookings()
    ])

    const totalItems = items.length
    const totalValue = items.reduce((sum, item) => sum + item.total_value, 0)
    const monthlyExpenses = expenses
      .filter(expense => expense.is_recurring && expense.recurring_period === 'monthly')
      .reduce((sum, expense) => sum + expense.amount, 0)
    const upcomingBookings = bookings.length

    return {
      totalItems,
      totalValue,
      monthlyExpenses,
      upcomingBookings,
      recentItems: items.slice(0, 5),
      recentExpenses: expenses.slice(0, 5),
      upcomingBookings: bookings.slice(0, 5)
    }
  },

  async getRecentExpenses(): Promise<ExpenseWithDetails[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        item:items(*),
        paid_by_profile:profiles(*),
        splits:expense_splits(
          *,
          profile:profiles(*)
        )
      `)
      .order('expense_date', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching recent expenses:', error)
      return []
    }

    return data as ExpenseWithDetails[]
  },

  async getUpcomingBookings(): Promise<BookingWithDetails[]> {
    const now = new Date().toISOString()
    
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        item:items(*),
        booker:profiles(*)
      `)
      .gte('start_date', now)
      .eq('status', 'confirmed')
      .order('start_date', { ascending: true })
      .limit(10)

    if (error) {
      console.error('Error fetching upcoming bookings:', error)
      return []
    }

    return data as BookingWithDetails[]
  }
}