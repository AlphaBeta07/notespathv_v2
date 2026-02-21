import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
// import { Input } from '../components/ui/input' // For search input
import { motion } from 'framer-motion'
import { Search, Upload, ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Material } from '../types'
import { MaterialCard } from '../components/MaterialCard'
import { useAuth } from '../context/AuthContext'
import { DotBackground } from '../components/DotBackground'

export default function LandingPage() {
    const [materials, setMaterials] = useState<Material[]>([])
    const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    // Filters
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedBranch, setSelectedBranch] = useState('')
    const [selectedModule, setSelectedModule] = useState('')
    const [selectedSemester, setSelectedSemester] = useState('')

    // Dropdown Data
    const branches = [
        "Computer Science",
        "AIML",
        "Information Technology",
        "Electronics & Telecommunication",
        "Mechanical Engineering",
        "Civil Engineering",
        "Electrical Engineering",
        "Mathematics",
        "Physics"
    ]
    const semesters = ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"]
    const modules = ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5"]


    useEffect(() => {
        fetchMaterials()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [searchQuery, selectedBranch, selectedModule, selectedSemester, materials])

    const fetchMaterials = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('materials')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                throw error
            }

            setMaterials(data || [])
            setFilteredMaterials(data || [])
        } catch (error) {
            console.error('Error fetching materials:', error)
        } finally {
            setLoading(false)
        }
    }

    const applyFilters = () => {
        let filtered = [...materials]

        // Search (Subject/Title/Uploader)
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(m =>
                (m.subject?.toLowerCase().includes(query)) ||
                (m.title?.toLowerCase().includes(query)) ||
                (m.uploader_name?.toLowerCase().includes(query))
            )
        }

        if (selectedBranch) {
            filtered = filtered.filter(m => m.branch === selectedBranch || m.subject === selectedBranch)
            // Fallback to subject check for legacy data if needed, but primarily branch
        }

        if (selectedModule) {
            filtered = filtered.filter(m => m.module === selectedModule)
        }

        if (selectedSemester) {
            filtered = filtered.filter(m => m.semester === selectedSemester)
        }

        setFilteredMaterials(filtered)
    }

    const resetFilters = () => {
        setSearchQuery('')
        setSelectedBranch('')
        setSelectedModule('')
        setSelectedSemester('')
    }

    const handleMaterialDelete = (id: string) => {
        const updated = materials.filter(m => m.id !== id)
        setMaterials(updated)
        // Re-filter will happen automatically via useEffect
    }

    return (
        <div className="flex min-h-screen flex-col relative overflow-hidden">
            <DotBackground />

            {/* Floating Navigation Bar */}
            <header className="fixed bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl bg-white/30 backdrop-blur-xl px-2 md:px-6 h-auto min-h-[64px] py-1.5 flex items-center justify-between border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[2rem] md:rounded-full supports-[backdrop-filter]:bg-white/20 transition-all hover:bg-white/40 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] gap-2">
                {/* Logo Area */}
                <div className="flex items-center shrink-0">
                    <div className="flex items-center gap-1 md:gap-2 px-2 md:px-0">
                        <span className="font-bold text-sm md:text-xl tracking-tight text-gray-900 drop-shadow-sm">
                            Notes<span className="text-blue-600">Pathv</span>
                        </span>
                    </div>
                </div>

                {/* Nav Buttons */}
                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                    <Link to="/upload">
                        <Button className="bg-black/90 hover:bg-black text-white shadow-lg rounded-full px-3 md:px-6 py-2 transition-all hover:scale-105 backdrop-blur-sm h-auto text-[11px] md:text-sm">
                            <Upload className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                            Upload notes
                        </Button>
                    </Link>

                    {/* Profile / Auth */}
                    {user ? (
                        <div className="flex items-center">
                            <Link to="/profile">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/50 overflow-hidden border border-white/80 shadow-sm hover:ring-2 hover:ring-blue-400 transition-all backdrop-blur-md">
                                    {/* Placeholder Avatar */}
                                    <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.email}&gender=male`} alt="User" className="w-full h-full object-cover" />
                                </div>
                            </Link>
                        </div>
                    ) : (
                        <Link to="/auth">
                            <Button variant="ghost" className="font-medium text-gray-800 hover:text-black hover:bg-white/50 rounded-full px-3 transition-colors h-auto py-2 text-[11px] md:text-sm">Sign In</Button>
                        </Link>
                    )}
                </div>
            </header>

            <main className="flex-1 container px-4 md:px-6 py-12 pb-32 md:pb-40 mx-auto max-w-7xl relative z-10">

                {/* HERO SECTION */}
                <div className="mb-16 md:mb-24 max-w-4xl mx-auto text-left md:text-left mt-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1] mb-6">
                            A smart repository <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                for engineering notes.
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-500 max-w-2xl leading-relaxed">
                            Share, discover, and learn with peers from college.
                        </p>
                        {/* <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1] mb-6">
                            Agents that help you <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                achieve liftoff
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-500 max-w-2xl leading-relaxed">
                            A smart repository for engineering notes. Share, discover, and learn with peers from your college.
                        </p> */}
                    </motion.div>
                </div>

                {/* FILTER BAR - Apple Liquid Glass Style */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="relative overflow-hidden bg-white/40 backdrop-blur-xl border border-black/60 rounded-3xl md:rounded-full py-4 md:py-2 px-4 md:px-3 mb-12 shadow-xl shadow-blue-900/5 flex flex-col md:flex-row gap-4 md:gap-2 items-center ring-1 ring-white/60 max-w-5xl mx-auto"
                >

                    {/* Search Input */}
                    <div className="relative flex-1 w-full md:min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-200/50 md:border-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 md:focus:ring-0 text-gray-700 bg-white/50 md:bg-transparent placeholder:text-gray-400 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="h-6 w-px bg-gray-300 hidden md:block mx-2" />

                    {/* Mobile Divider */}
                    <div className="w-full h-px bg-gray-200 md:hidden" />

                    {/* Dropdowns */}
                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-auto">
                            <select
                                className="h-10 px-4 py-2 rounded-full border border-gray-200 bg-white/50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full md:w-auto hover:bg-white/80 transition-colors cursor-pointer appearance-none"
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                            >
                                <option value="">Select Branch</option>
                                {branches.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                            <div className="absolute right-3 top-3 pointer-events-none">
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            </div>
                        </div>

                        <div className="relative w-full md:w-auto">
                            <select
                                className="h-10 px-4 py-2 rounded-full border border-gray-200 bg-white/50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full md:w-auto hover:bg-white/80 transition-colors cursor-pointer appearance-none"
                                value={selectedModule}
                                onChange={(e) => setSelectedModule(e.target.value)}
                            >
                                <option value="">Module</option>
                                {modules.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <div className="absolute right-3 top-3 pointer-events-none">
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            </div>
                        </div>

                        <div className="relative w-full md:w-auto">
                            <select
                                className="h-10 px-4 py-2 rounded-full border border-gray-200 bg-white/50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full md:w-auto hover:bg-white/80 transition-colors cursor-pointer appearance-none"
                                value={selectedSemester}
                                onChange={(e) => setSelectedSemester(e.target.value)}
                            >
                                <option value="">Semester</option>
                                {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <div className="absolute right-3 top-3 pointer-events-none">
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-px bg-gray-200 md:hidden" />

                    {/* Reset Button */}
                    <Button variant="ghost" className="w-full md:w-auto rounded-full text-xs text-rose-500 hover:bg-rose-50 hover:text-rose-600 px-4" onClick={resetFilters}>
                        Reset Filters
                    </Button>
                </motion.div>


                {/* MATERIALS GRID */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-2xl font-bold text-gray-900">Recent Uploads</h2>
                        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{filteredMaterials.length} results</span>
                    </div>

                    {loading ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-[250px] rounded-xl border bg-gray-100 animate-pulse"></div>
                            ))}
                        </div>
                    ) : filteredMaterials.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
                        >
                            {filteredMaterials.map((material, index) => (
                                <motion.div
                                    key={material.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                >
                                    <MaterialCard material={material} onDelete={handleMaterialDelete} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-20 bg-white/50 rounded-2xl border border-dashed border-gray-200 backdrop-blur-sm">
                            <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Search className="w-6 h-6 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No notes found</h3>
                            <p className="text-gray-500 mt-1 mb-6">Try adjusting your filters or search query.</p>
                            <Button variant="outline" onClick={resetFilters}>Clear all filters</Button>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="py-12 relative z-10 border-t border-gray-100 bg-white/40 backdrop-blur-sm mt-12">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-center md:text-left">
                            <span className="font-bold text-xl tracking-tight text-gray-900">
                                Notes<span className="text-blue-600">Pathv</span>
                            </span>
                            <p className="text-sm text-gray-500 mt-2 max-w-xs">
                                Empowering students to share knowledge and ace their exams together.
                            </p>
                        </div>

                        {/* <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
                            <a href="#" className="hover:text-blue-600 transition-colors">About</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
                        </div> */}
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-200/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                        <p>© 2026 NotesPathv. All rights reserved.</p>
                        <p className="flex items-center ">
                            Made with <span className="text-rose-500">❤️</span> by
                            <a href="https://anishlandage.fun" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition-colors font-medium">
                                Anish Landage
                            </a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
