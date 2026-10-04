import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

export default function ProtectedLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-500 pb-32 md:pb-40">
                <Outlet />
            </main>
        </div>
    )
}
