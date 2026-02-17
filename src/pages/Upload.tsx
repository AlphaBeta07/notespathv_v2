import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Loader2, UploadCloud, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { DotBackground } from '../components/DotBackground'
import { motion } from 'framer-motion'

export default function Upload() {
    const [title, setTitle] = useState('')
    const [branch, setBranch] = useState('')
    const [subject, setSubject] = useState('')
    const [semester, setSemester] = useState('')
    const [module, setModule] = useState('')
    const [college, setCollege] = useState('')
    const [uploaderName, setUploaderName] = useState('')

    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { user } = useAuth()
    const navigate = useNavigate()

    const branches = [
        "Computer Science",
        "AIML",
        "Information Technology",
        "Electronics & Telecommunication",
        "Mechanical Engineering",
        "Civil Engineering",
        "Electrical Engineering"
    ]

    const semesters = ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"]
    const modules = ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5"]

    const [availableSubjects, setAvailableSubjects] = useState<string[]>([])

    // Predefined subjects for common branches
    const predefinedSubjects: Record<string, string[]> = {
        "Computer Science": ["Data Structures", "Algorithms", "Database Management Systems", "Operating Systems", "Computer Networks", "Object Oriented Programming", "Discrete Mathematics", "Digital Logic Design", "Theory of Computation", "Compiler Design"],
        "AIML": ["Artificial Intelligence", "Machine Learning", "Deep Learning", "Data Science", "Natural Language Processing", "Statistics for Data Science", "Python Programming"],
        "Information Technology": ["Web Development", "Software Engineering", "Information Security", "Cloud Computing", "Data Mining", "E-Commerce"],
        "Electronics & Telecommunication": ["Analog Circuits", "Digital Circuits", "Signals and Systems", "Control Systems", "Microprocessors", "Communication Systems", "Electromagnetics"],
        "Mechanical Engineering": ["Thermodynamics", "Fluid Mechanics", "Strength of Materials", "Kinematics of Machines", "Dynamics of Machinery", "Heat Transfer", "Manufacturing Processes"],
        "Civil Engineering": ["Structural Analysis", "Geotechnical Engineering", "Fluid Mechanics", "Surveying", "Transportation Engineering", "Environmental Engineering", "Concrete Technology"],
        "Electrical Engineering": ["Circuit Theory", "Electrical Machines", "Power Systems", "Control Systems", "Power Electronics", "Analog and Digital Electronics"],
        "Mathematics": ["Engineering Mathematics I", "Engineering Mathematics II", "Engineering Mathematics III", "Engineering Mathematics IV", "Probability and Statistics"],
        "Physics": ["Engineering Physics", "Quantum Physics", "Optics", "Solid State Physics"]
    }




    // Fetch existing subjects when branch is selected
    useEffect(() => {
        if (!branch) {
            setAvailableSubjects([])
            return
        }

        const fetchSubjects = async () => {
            let combinedSubjects = new Set<string>()

            // 1. Add predefined subjects for the branch
            const branchSubjects = predefinedSubjects[branch] || []
            branchSubjects.forEach(s => combinedSubjects.add(s))

            try {
                // 3. Fetch from DB
                const { data, error } = await supabase
                    .from('materials')
                    .select('subject')
                    .eq('branch', branch)

                if (error) throw error

                if (data) {
                    data.forEach(item => {
                        if (item.subject) combinedSubjects.add(item.subject)
                    })
                }
            } catch (err) {
                console.error('Error fetching subjects:', err)
            } finally {
                // Convert to array and sort
                setAvailableSubjects(Array.from(combinedSubjects).sort())
            }
        }

        fetchSubjects()
    }, [branch])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file || !user) return

        if (!title) {
            setError("Please enter a title")
            return
        }
        if (!branch) {
            setError("Please select a branch")
            return
        }
        if (!subject) {
            setError("Please enter a subject")
            return
        }

        setUploading(true)
        setError(null)

        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
            const filePath = `${user.id}/${fileName}`

            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('materials')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('materials')
                .getPublicUrl(filePath)

            // 3. Insert into Database
            const { error: dbError } = await supabase
                .from('materials')
                .insert({
                    title: title,
                    description: college,
                    file_url: publicUrl,
                    user_id: user.id,
                    branch,
                    subject,
                    semester,
                    module,
                    college_details: college,
                    uploader_name: uploaderName
                })

            if (dbError) throw dbError

            navigate('/')
        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Error uploading material')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            <DotBackground />

            {/* Minimal Header */}
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
                    className="w-full max-w-2xl relative"
                >

                    {/* Glass Container */}
                    <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-8 md:p-10 shadow-2xl shadow-blue-900/10 ring-1 ring-white/80">

                        <div className="mb-8 text-center">
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Upload Material</h2>
                            <p className="text-gray-500 mt-2">Share your knowledge and help others learn.</p>
                        </div>

                        {/* Upload Zone */}
                        <div className={`mb-8 border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all relative group ${file ? 'border-green-500/50 bg-green-50/50' : 'border-gray-300 hover:border-blue-500/50 hover:bg-white/60'}`}>
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onChange={handleFileChange}
                                required={!file}
                            />
                            {file ? (
                                <div className="flex flex-col items-center gap-3 text-green-700 z-20 animate-in zoom-in-50 duration-300">
                                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center shadow-sm">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="font-semibold text-lg max-w-[250px] truncate">{file.name}</span>
                                        <span className="text-xs text-green-600/80">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 mt-2"
                                        onClick={(e) => { e.preventDefault(); setFile(null); }}
                                    >
                                        Change File
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-blue-50 group-hover:scale-110 transition-transform flex items-center justify-center mb-4 shadow-sm border border-blue-100">
                                        <UploadCloud className="w-8 h-8 text-blue-500" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Click to upload or drag and drop</h3>
                                    <p className="text-sm text-gray-500 mt-1">PDF, DOC, Images (Max 10MB)</p>
                                </>
                            )}
                        </div>

                        <form onSubmit={handleUpload} className="space-y-5">
                            {/* Title Input */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Title</label>
                                <Input
                                    placeholder="e.g. Data Structures Unit 1 Notes"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="bg-white/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 h-12 rounded-xl"
                                    required
                                />
                            </div>

                            {/* Branch Select */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Branch</label>
                                <div className="relative">
                                    <select
                                        className="flex h-12 w-full rounded-xl border border-gray-200 bg-white/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 appearance-none transition-all"
                                        value={branch}
                                        onChange={(e) => setBranch(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled selected>Select Branch</option>
                                        {branches.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                    <div className="absolute right-3 top-4 pointer-events-none">
                                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Subject Input (Combobox) */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Subject</label>
                                <Input
                                    placeholder="Search or type subject..."
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="bg-white/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 h-12 rounded-xl"
                                    required
                                    list="subject-suggestions"
                                />
                                <datalist id="subject-suggestions">
                                    {availableSubjects.map((subj) => (
                                        <option key={subj} value={subj} />
                                    ))}
                                </datalist>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-5">
                                {/* Semester Select */}
                                <div className="space-y-1 w-full sm:w-1/2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Semester</label>
                                    <div className="relative">
                                        <select
                                            className="flex h-12 w-full rounded-xl border border-gray-200 bg-white/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white appearance-none transition-all"
                                            value={semester}
                                            onChange={(e) => setSemester(e.target.value)}
                                        >
                                            <option value="" disabled selected>Select Semester</option>
                                            {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <div className="absolute right-3 top-4 pointer-events-none">
                                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Module Select */}
                                <div className="space-y-1 w-full sm:w-1/2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Module</label>
                                    <div className="relative">
                                        <select
                                            className="flex h-12 w-full rounded-xl border border-gray-200 bg-white/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white appearance-none transition-all"
                                            value={module}
                                            onChange={(e) => setModule(e.target.value)}
                                        >
                                            <option value="" disabled selected>Select Module</option>
                                            {modules.map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                        <div className="absolute right-3 top-4 pointer-events-none">
                                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* College Input */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">College Details</label>
                                <Input
                                    placeholder="e.g. IIT Bombay, Prof. Sharma"
                                    value={college}
                                    onChange={(e) => setCollege(e.target.value)}
                                    className="bg-white/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 h-12 rounded-xl"
                                />
                            </div>

                            {/* Uploader Name */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Your Name</label>
                                <Input
                                    placeholder="Enter your name (Optional)"
                                    value={uploaderName}
                                    onChange={(e) => setUploaderName(e.target.value)}
                                    className="bg-white/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 h-12 rounded-xl"
                                />
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm text-center animate-in fade-in slide-in-from-top-2">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-xl h-14 shadow-lg shadow-black/5 hover:shadow-black/10 hover:scale-[1.01] transition-all mt-4"
                                disabled={uploading}
                            >
                                {uploading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                {uploading ? 'Uploading...' : 'Publish Note'}
                            </Button>
                        </form>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}
