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
        try {
            const res = await fetch('/api/auth/session')
            if (res.ok) {
                const data = await res.json()
                setUser(data.user)
            } else {
                setUser(null)
            }
        } catch (e) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkSession()
    }, [])

    const signOut = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        setUser(null)
    }

    const value = {
        session: user ? { user } : null,
        user,
        loading,
        signOut,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
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
