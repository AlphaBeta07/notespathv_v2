import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from './ui/button'
import { LayoutDashboard, Upload, User, LogOut } from 'lucide-react'
import { cn } from '../lib/utils'

export default function ProtectedLayout() {
    const { signOut } = useAuth()
    const location = useLocation()

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/upload', label: 'Upload', icon: Upload },
        { href: '/profile', label: 'Profile', icon: User },
    ]

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Floating Navigation Bar */}
            <header className="fixed bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl bg-white/30 backdrop-blur-xl px-2 md:px-6 h-[72px] md:h-16 flex items-center justify-between border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[2rem] md:rounded-full supports-[backdrop-filter]:bg-white/20 transition-all hover:bg-white/40 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]">

                {/* Logo (Hidden on mobile to prioritize nav items) */}
                <Link to="/" className="hidden md:flex items-center gap-2 pl-2 md:pl-0 shrink-0">
                    <span className="font-bold text-lg md:text-xl tracking-tight text-gray-900 drop-shadow-sm">
                        Notes<span className="text-blue-600">Pathv</span>
                    </span>
                </Link>

                {/* Navigation Links */}
                <nav className="flex items-center justify-between w-full md:w-auto md:gap-2 px-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-sm font-medium transition-all duration-200 rounded-2xl md:rounded-full min-w-[64px]",
                                location.pathname === item.href
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                    : "text-gray-700 hover:text-gray-900 hover:bg-white/50"
                            )}
                        >
                            <item.icon className="h-5 w-5 md:h-4 md:w-4" />
                            <span>{item.label}</span>
                        </Link>
                    ))}

                    {/* Logout Action integrated into nav on mobile */}
                    <div className="flex justify-center md:border-l md:border-gray-300 md:pl-2 ml-1">
                        <Button
                            variant="ghost"
                            className="flex flex-col md:flex-row h-auto items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-sm text-gray-700 hover:text-red-600 hover:bg-white/50 rounded-2xl md:rounded-full transition-colors min-w-[64px]"
                            onClick={signOut}
                        >
                            <LogOut className="h-5 w-5 md:h-4 md:w-4" />
                            <span>Logout</span>
                        </Button>
                    </div>
                </nav>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-500 pb-32 md:pb-40">
                <Outlet />
            </main>
        </div>
    )
}
