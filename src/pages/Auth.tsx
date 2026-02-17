import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Loader2, ArrowLeft, Mail, Lock, ShieldCheck, UserPlus, LogIn, AlertCircle } from 'lucide-react'
import { DotBackground } from '../components/DotBackground'
import { motion } from 'framer-motion'

export default function AuthPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [isLogin, setIsLogin] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                navigate('/dashboard')
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                })
                if (error) throw error
                // For simple email/pass, auto login or message to check email
                // If Supabase confirms immediately (disable email confirm), we might need auto sigin.
                // Usually signUp returns session if auto-confirm is on.
                navigate('/dashboard')
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden font-sans">
            <DotBackground />

            {/* Header */}
            <header className="absolute top-0 left-0 w-full z-20 p-6">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition-colors bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/60 shadow-sm hover:shadow-md">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="font-medium text-sm">Back to Home</span>
                </Link>
            </header>

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
                                {isLogin ? <LogIn className="w-6 h-6 text-white" /> : <UserPlus className="w-6 h-6 text-white" />}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                                {isLogin ? 'Welcome back' : 'Create an account'}
                            </h2>
                            <p className="text-sm text-gray-500 mt-2">
                                {isLogin ? 'Enter your credentials to access your account' : 'Enter your details to get started'}
                            </p>
                        </div>

                        <form onSubmit={handleAuth} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 bg-white/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 h-11 rounded-xl transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Password</label>
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

                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl h-11 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all mt-2"
                                type="submit"
                                disabled={loading}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isLogin ? 'Sign In' : 'Sign Up'}
                            </Button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-gray-200/50 text-center">
                            <p className="text-sm text-gray-500">
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors focus:outline-none"
                                >
                                    {isLogin ? "Sign Up" : "Login"}
                                </button>
                            </p>
                        </div>

                        <div className="mt-6 flex justify-center text-xs text-gray-400 gap-4">
                            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Secure</span>
                            <span>•</span>
                            <span className="hover:text-gray-600 cursor-pointer transition-colors">Privacy</span>
                            <span>•</span>
                            <span className="hover:text-gray-600 cursor-pointer transition-colors">Terms</span>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}
