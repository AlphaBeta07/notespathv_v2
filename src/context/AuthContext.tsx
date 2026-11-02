import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'

type AuthContextType = {
    session: any | null
    user: User | null
    loading: boolean
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const checkSession = async () => {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 2500)

        try {
            const res = await fetch('/api/auth/session', { signal: controller.signal })
            clearTimeout(timeoutId)
            if (res.ok) {
                const data = await res.json()
                setUser(data.user)
            } else {
                setUser(null)
            }
        } catch (e) {
            clearTimeout(timeoutId)
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkSession()
    }, [])

    const signOut = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
        } catch (e) {
            console.error('Logout error:', e)
        } finally {
            setUser(null)
        }
    }

    const value = {
        session: user ? { user } : null,
        user,
        loading,
        signOut,
    }

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="min-h-screen flex items-center justify-center bg-slate-50">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
