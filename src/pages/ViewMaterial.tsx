import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Material } from '../types'
import { Document, Page, pdfjs } from 'react-pdf'
import { Button } from '../components/ui/button'
import { ArrowLeft, Download, Share2, Maximize2, Loader2 } from 'lucide-react'

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

export default function ViewMaterial() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [material, setMaterial] = useState<Material | null>(null)
    const [loading, setLoading] = useState(true)
    const [numPages, setNumPages] = useState<number | null>(null)

    useEffect(() => {
        const fetchMaterial = async () => {
            if (!id) return
            try {
                const { data, error } = await supabase
                    .from('materials')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) throw error
                setMaterial(data)
            } catch (error) {
                console.error('Error fetching material:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchMaterial()
    }, [id])

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!material) {
        return (
            <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4">
                <h2 className="text-xl font-semibold">Material not found</h2>
                <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
            </div>
        )
    }

    const isPDF = material.file_url.toLowerCase().includes('.pdf')
    const isImage = material.file_url.match(/\.(jpeg|jpg|gif|png)$/i) != null

    return (
        <div className="h-[calc(100vh-5rem)] flex flex-col gap-4">
            {/* Header / Actions */}
            <div className="flex items-center justify-between bg-white p-2 rounded-lg border shadow-sm">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500 hidden sm:inline-block">
                        {material.subject} {material.module && `| ${material.module}`}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <a href={`https://wa.me/?text=Check out this note: ${encodeURIComponent(material.title || 'Note')} - ${encodeURIComponent(material.file_url)}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" title="Share on WhatsApp">
                            <Share2 className="h-4 w-4 text-green-600" />
                        </Button>
                    </a>
                    <a href={material.file_url} download target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" title="Download">
                            <Download className="h-4 w-4" />
                        </Button>
                    </a>
                </div>
            </div>

            {/* Content Split View */}
            <div className="flex flex-col lg:flex-row gap-4 h-full overflow-hidden">

                {/* LEFT: Viewer */}
                <div className="flex-1 bg-black/90 rounded-xl overflow-hidden shadow-lg flex items-center justify-center relative group">
                    <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a href={material.file_url} target="_blank" rel="noreferrer">
                            <Button size="icon" variant="secondary">
                                <Maximize2 className="h-4 w-4" />
                            </Button>
                        </a>
                    </div>

                    <div className="w-full h-full overflow-auto flex justify-center p-4 scrollbar-hide">
                        {isImage && (
                            <img
                                src={material.file_url}
                                alt={material.title}
                                className="max-w-full max-h-full object-contain shadow-2xl"
                            />
                        )}

                        {isPDF && (
                            <Document
                                file={material.file_url}
                                onLoadSuccess={onDocumentLoadSuccess}
                                className="max-w-full"
                            >
                                {Array.from(new Array(numPages), (_, index) => (
                                    <Page
                                        key={`page_${index + 1}`}
                                        pageNumber={index + 1}
                                        width={window.innerWidth > 1024 ? 600 : window.innerWidth - 40}
                                        className="mb-4 shadow-xl"
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                    />
                                ))}
                            </Document>
                        )}

                        {!isImage && !isPDF && (
                            <div className="text-white text-center">
                                <p className="mb-4">Preview not available for this file type.</p>
                                <Button asChild variant="secondary">
                                    <a href={material.file_url} target="_blank" rel="noopener noreferrer">Download to View</a>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Sidebar (Details & Comments) */}
                <div className="w-full lg:w-80 xl:w-96 bg-[#FFFBE6] rounded-xl border border-yellow-100 shadow-sm flex flex-col overflow-hidden shrink-0">
                    <div className="p-4 border-b border-yellow-200/50 bg-[#FFFBE6]">
                        <h1 className="font-serif text-2xl font-bold text-gray-800 leading-tight">
                            {material.title}
                        </h1>
                        <div className="mt-4 space-y-2 text-sm text-gray-700 font-mono">
                            {material.subject && <p><span className="text-gray-400">Subject:</span> {material.subject}</p>}
                            {material.module && <p><span className="text-gray-400">Module:</span> {material.module}</p>}
                            {material.semester && <p><span className="text-gray-400">Sem:</span> {material.semester}</p>}
                            <p className="pt-2 text-xs text-gray-400">Uploaded by {material.uploader_name || 'Anonymous'} on {new Date(material.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* <div className="flex-1 p-8 flex flex-col items-center justify-center text-center text-gray-400 bg-white/50">
                        <MessageSquare className="h-12 w-12 mb-3 opacity-20" />
                        <p className="text-sm">No comments yet</p>
                        <p className="text-xs mt-1 text-gray-300">Start the discussion</p>
                    </div>

                    <div className="p-4 bg-white/50 border-t border-yellow-200/50 text-center">
                        <p className="text-xs text-gray-400">Please sign in to comment</p>
                    </div> */}
                </div>

            </div>
        </div>
    )
}
