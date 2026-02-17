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
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-accent/40 px-6 py-2 rounded-full border border-accent shadow-sm">
                            <span className="font-bold text-lg tracking-tight text-foreground">
                                Notes<span className="text-primary">Pathv</span>
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Links (Desktop) */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                                    location.pathname === item.href
                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Logout / Profile Actions */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-2"
                            onClick={signOut}
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
                <Outlet />
            </main>

            {/* Mobile Bottom Nav (Optional, helpful for mobile) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 px-4 py-2 flex justify-around items-center">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                            "flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors",
                            location.pathname === item.href
                                ? "text-primary"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </Link>
                ))}
            </div>
        </div>
    )
}
