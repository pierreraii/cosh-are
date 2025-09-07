import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Profile, ItemWithOwners } from '@/types/database'
import { profileService, itemService, dashboardService } from '@/services/database'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  items: ItemWithOwners[]
  dashboardStats: any | null
  loading: boolean
  profileLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  refreshData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [items, setItems] = useState<ItemWithOwners[]>([])
  const [dashboardStats, setDashboardStats] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)

  const loadUserData = async () => {
    if (!user) return
    
    setProfileLoading(true)
    try {
      // Load user profile
      const userProfile = await profileService.getCurrentProfile()
      setProfile(userProfile)

      // Load user items
      const userItems = await itemService.getUserItems()
      setItems(userItems)

      // Load dashboard stats
      const stats = await dashboardService.getDashboardStats()
      setDashboardStats(stats)
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setProfileLoading(false)
    }
  }

  const refreshProfile = async () => {
    if (!user) return
    const userProfile = await profileService.getCurrentProfile()
    setProfile(userProfile)
  }

  const refreshData = async () => {
    await loadUserData()
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        
        if (event === 'SIGNED_OUT') {
          setProfile(null)
          setItems([])
          setDashboardStats(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Load user data when user is available
  useEffect(() => {
    if (user && !loading) {
      loadUserData()
    }
  }, [user, loading])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    session,
    profile,
    items,
    dashboardStats,
    loading,
    profileLoading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    refreshData
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}