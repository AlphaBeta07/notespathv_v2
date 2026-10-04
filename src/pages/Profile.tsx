import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { DotBackground } from '../components/DotBackground'
import { Link } from 'react-router-dom'
import { ArrowLeft, LogOut, User } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Profile() {
    const { user, signOut } = useAuth()

    if (!user) return null

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
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="relative overflow-hidden bg-white/60 backdrop-blur-2xl border border-white/50 rounded-3xl p-8 shadow-2xl shadow-blue-900/5 ring-1 ring-white/60 flex flex-col items-center text-center">

                        <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg ring-1 ring-gray-100 mb-6 relative group transform transition-transform hover:scale-105">
                            <Avatar className="w-full h-full">
                                <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.email}&gender=male`} />
                                <AvatarFallback className="text-2xl bg-blue-50 text-blue-600 font-bold">
                                    {user.email?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">{user.email?.split('@')[0]}</h2>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium mb-8">
                            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                            {user.email}
                        </div>

                        <div className="w-full space-y-3">
                            <Button
                                variant="outline"
                                className="w-full h-12 rounded-xl bg-white/50 hover:bg-white border-gray-200 text-gray-700 hover:text-black justify-start px-4 transition-all hover:shadow-sm group"
                            >
                                <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-gray-200 mr-3 transition-colors">
                                    <User className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
                                </div>
                                <span className="font-medium">Edit Profile</span>
                                <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Coming Soon</span>
                            </Button>

                            <Button
                                variant="destructive"
                                onClick={signOut}
                                className="w-full h-12 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 hover:border-red-200 justify-start px-4 transition-all hover:shadow-sm group"
                            >
                                <div className="p-1.5 rounded-lg bg-red-100 group-hover:bg-red-200 mr-3 transition-colors">
                                    <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-700" />
                                </div>
                                <span className="font-medium">Sign Out</span>
                            </Button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200/50 w-full text-center">
                            <p className="text-xs text-gray-400 font-medium">Member since {new Date().getFullYear()}</p>
                        </div>

                    </div>
                </motion.div>
            </main>
        <footer className="py-12 relative z-10 border-t border-gray-100 bg-white/40 backdrop-blur-sm mt-auto">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                    <div>
                        <span className="font-bold text-xl tracking-tight text-gray-900">
                            Notes<span className="text-blue-600">Pathv</span>
                        </span>
                        <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto md:mx-0">
                            Empowering students to share knowledge and ace their exams together.
                        </p>
                    </div>
                    <p className="text-gray-600">© 2026 NotesPathv. All rights reserved.</p>
                    <p className="flex items-center gap-1 text-gray-600">
                        <span>Developed by</span>
                        <a href="https://anishlandage.fun" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors font-medium">
                            Anish Landage
                        </a>
                    </p>
                </div>
            </div>
        </footer>
        </div>
    )
}
