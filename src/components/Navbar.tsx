import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, LayoutDashboard, Upload, User } from 'lucide-react'
import { cn } from '../lib/utils'
import { useAuth } from '../context/AuthContext'

export function Navbar() {
    const { user } = useAuth()
    const location = useLocation()
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navItems = user ? [
        { href: '/', label: 'Home', icon: Home },
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/upload', label: 'Upload', icon: Upload },
        { href: '/profile', label: 'Profile', icon: User },
    ] : [
        { href: '/', label: 'Home', icon: Home },
        { href: '/upload', label: 'Upload', icon: Upload },
    ]

    return (
        <header
            className={cn(
                "fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                scrolled ? "bottom-2 md:bottom-6" : "bottom-4 md:bottom-8"
            )}
        >
            <div
                className={cn(
                    "flex items-center justify-between px-2 md:px-3 h-16 md:h-[68px] rounded-full relative transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    // Ambient shadow + contact shadow
                    scrolled 
                        ? "shadow-[0_12px_40px_-10px_rgba(0,0,0,0.15),0_4px_12px_-2px_rgba(0,0,0,0.05)] bg-white/45" 
                        : "shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1),0_2px_8px_-2px_rgba(0,0,0,0.04)] bg-white/35"
                )}
                style={{
                    backdropFilter: scrolled ? 'blur(24px) saturate(190%)' : 'blur(16px) saturate(160%)',
                    WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(190%)' : 'blur(16px) saturate(160%)',
                }}
            >
                {/* 
                    Multi-layer border system for Liquid Glass:
                    1. Inner bright top edge reflection
                    2. Very subtle darker bottom edge for depth
                */}
                <div className="absolute inset-0 rounded-full pointer-events-none border-[0.5px] border-white/60 mix-blend-overlay" />
                <div className="absolute inset-0 rounded-full pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),inset_0_-1px_1px_rgba(0,0,0,0.05)]" />

                {/* Logo */}
                <Link to="/" className="hidden md:flex items-center gap-2 pl-4 pr-2 shrink-0 relative z-10 group outline-none focus-visible:ring-2 focus-visible:ring-black/20 rounded-full">
                    <span className="font-semibold text-lg tracking-tight text-gray-900 drop-shadow-sm group-hover:opacity-80 transition-opacity">
                        Notes<span className="text-blue-600">Pathv</span>
                    </span>
                </Link>

                {/* Navigation Links */}
                <nav className="flex items-center justify-center w-full relative z-10 px-1 md:px-0 h-full py-1.5">
                    <div className="flex items-center justify-between w-full md:w-auto md:justify-center md:gap-1 relative h-full">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className="relative flex flex-1 flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-1 md:px-4 h-full text-[10px] md:text-sm font-medium transition-colors outline-none rounded-full md:min-w-[80px] group"
                                >
                                    {/* Active Indicator (Liquid Glass Pill) */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNavIndicator"
                                            className="absolute inset-0 rounded-full bg-white/60 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
                                            style={{
                                                backdropFilter: 'blur(8px)',
                                                WebkitBackdropFilter: 'blur(8px)',
                                            }}
                                            initial={false}
                                            transition={{
                                                type: "spring",
                                                stiffness: 400,
                                                damping: 30,
                                                mass: 0.8
                                            }}
                                        >
                                            {/* Active pill glass highlights */}
                                            <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(0,0,0,0.03)] border border-white/50" />
                                            {/* Subtle internal glow gradient */}
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
                                        </motion.div>
                                    )}

                                    {/* Link Content with hover + press effect */}
                                    <motion.div 
                                        className="relative z-10 flex flex-col md:flex-row items-center gap-1 md:gap-2 w-full justify-center"
                                        whileTap={{ scale: 0.97 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    >
                                        {/* Hover illumination effect behind icon/text */}
                                        <div className={cn(
                                            "absolute inset-[-8px] rounded-full bg-white/0 transition-colors duration-200 -z-10",
                                            !isActive && "group-hover:bg-white/20"
                                        )} />

                                        <motion.div
                                            animate={{ 
                                                scale: isActive ? 1.05 : 1,
                                                color: isActive ? '#000000' : '#4b5563',
                                                opacity: isActive ? 1 : 0.85
                                            }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="group-hover:text-black group-hover:opacity-100 transition-all flex items-center justify-center"
                                        >
                                            <item.icon className="h-5 w-5 md:h-[18px] md:w-[18px]" strokeWidth={isActive ? 2.5 : 2} />
                                        </motion.div>
                                        
                                        <motion.span 
                                            animate={{
                                                color: isActive ? '#000000' : '#4b5563',
                                                fontWeight: isActive ? 600 : 500,
                                                opacity: isActive ? 1 : 0.85
                                            }}
                                            className="group-hover:text-black group-hover:opacity-100 transition-all tracking-tight text-center"
                                        >
                                            {item.label}
                                        </motion.span>
                                    </motion.div>
                                </Link>
                            )
                        })}
                    </div>

                </nav>
            </div>
        </header>
    )
}
