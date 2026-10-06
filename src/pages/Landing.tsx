import { Button } from '../components/ui/button'
import { motion } from 'framer-motion'
import { Search, ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Material } from '../types'
import { MaterialCard } from '../components/MaterialCard'
import { DotBackground } from '../components/DotBackground'
import { Navbar } from '../components/Navbar'

export default function LandingPage() {
    const [materials, setMaterials] = useState<Material[]>([])
    const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([])
    const [loading, setLoading] = useState(true)

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
            const res = await fetch('/api/materials')
            if (!res.ok) throw new Error('Failed to fetch materials')
            
            const { data } = await res.json()
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

            <Navbar />

            <main className="flex-1 container px-4 md:px-6 py-12 pb-32 md:pb-40 mx-auto max-w-7xl relative z-10">

                {/* HERO SECTION */}
                <div className="mb-16 md:mb-24 max-w-4xl mx-auto text-left md:text-left mt-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-4 flex items-center justify-start md:justify-start gap-4 flex-wrap">
                            <span className="font-bold text-lg md:text-2xl tracking-tight text-gray-900 drop-shadow-sm bg-white/50 px-4 py-1.5 rounded-full border border-gray-200/50 inline-flex items-center">
                                Notes<span className="text-blue-600 ml-1">Pathv</span>
                            </span>
                            {/* <Link to="/ainotes">
                                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-lg shadow-blue-500/20 px-4 py-1.5 md:py-2 flex items-center gap-2 font-medium transition-all transform hover:scale-105 active:scale-95 border border-blue-400">
                                    <span className="text-lg">✨</span>
                                    <span>AI Notes Bot</span>
                                </Button>
                            </Link> */}
                        </div>
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

        </div>
    )
}
