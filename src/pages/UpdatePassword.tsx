import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Loader2, Lock, ShieldCheck, AlertCircle } from 'lucide-react'
import { DotBackground } from '../components/DotBackground'
import { motion } from 'framer-motion'

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        // Automatically fetch the session to ensure the user actually came from a recovery link
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                // If there's no session, it means the recovery link was invalid or expired
                // or the user navigated here manually without a valid token.
                setError("No active session found. If your link expired, please request a new one.")
            }
        }
        checkSession()
    }, [])

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccessMsg(null)

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            })

            if (error) throw error
            setSuccessMsg("Password updated successfully! Redirecting...")
            setTimeout(() => {
                navigate('/dashboard')
            }, 2000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden font-sans">
            <DotBackground />

            <main className="flex-1 flex items-center justify-center py-20 px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="relative overflow-hidden bg-white/60 backdrop-blur-2xl border border-white/50 rounded-3xl p-8 shadow-2xl shadow-blue-900/5 ring-1 ring-white/60">

                        <div className="text-center mb-8">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20 transform rotate-3">
                                <Lock className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                                Update Password
                            </h2>
                            <p className="text-sm text-gray-500 mt-2">
                                Enter your new password below.
                            </p>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 bg-white/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 h-11 rounded-xl transition-all"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-start gap-2 text-red-600 text-sm animate-in fade-in slide-in-from-top-2">
                                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                    <span className="leading-snug">{error}</span>
                                </div>
                            )}

                            {successMsg && (
                                <div className="p-3 rounded-lg bg-green-50 border border-green-100 flex items-start gap-2 text-green-700 text-sm animate-in fade-in slide-in-from-top-2">
                                    <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />
                                    <span className="leading-snug">{successMsg}</span>
                                </div>
                            )}

                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl h-11 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all mt-2"
                                type="submit"
                                disabled={loading}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Password
                            </Button>
                        </form>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}
