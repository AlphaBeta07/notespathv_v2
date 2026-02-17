import { Material } from '../types'
import { Link } from 'react-router-dom'
// import { Card } from './ui/card' // Using base Card, but will customize content significantly
import { Button } from './ui/button'
import { FileText, Bookmark, Share2, Trash2, Loader2, X, Copy, Check } from 'lucide-react' // Using Share2 for WhatsApp placeholder
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Document, Page, pdfjs } from 'react-pdf'

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

interface MaterialCardProps {
    material: Material
    onDelete?: (id: string) => void
}

export function MaterialCard({ material, onDelete }: MaterialCardProps) {
    const { user } = useAuth()
    const [isDeleting, setIsDeleting] = useState(false)
    const [pdfError, setPdfError] = useState(false)
    const [isShareOpen, setIsShareOpen] = useState(false)
    const [copied, setCopied] = useState(false)

    const isOwner = user?.id === material.user_id

    // Check if file is PDF
    const isPDF = material.file_url.toLowerCase().includes('.pdf')
    // Check if file is Image
    const isImage = material.file_url.match(/\.(jpeg|jpg|gif|png)$/i) != null

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this material?')) return

        setIsDeleting(true)
        try {
            const urlObj = new URL(material.file_url)
            const pathSegments = urlObj.pathname.split('/')
            const fileName = pathSegments[pathSegments.length - 1]
            const filePath = `${material.user_id}/${fileName}`

            await supabase.storage.from('materials').remove([filePath])

            const { error } = await supabase
                .from('materials')
                .delete()
                .eq('id', material.id)

            if (error) throw error

            if (onDelete) onDelete(material.id)
        } catch (error) {
            console.error('Error deleting material:', error)
            alert('Failed to delete material')
        } finally {
            setIsDeleting(false)
        }
    }

    const handleShare = () => {
        setIsShareOpen(true)
    }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(material.file_url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // Formatting Date
    const dateStr = new Date(material.created_at).toLocaleDateString('en-GB') // DD/MM/YYYY format commonly used in India/UK

    return (
        <>
            <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col h-full">
                    <div className="flex flex-row p-4 gap-4 h-full">
                        {/* LEFT COLUMN: Details */}
                        <div className="flex-1 flex flex-col justify-between space-y-3">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2">
                                    {material.title || material.subject || "Untitled"}
                                </h3>

                                <div className="mt-3 space-y-1.5 text-sm text-gray-600">
                                    {material.subject && (
                                        <p><span className="text-gray-500">Subject:</span> {material.subject}</p>
                                    )}
                                    {material.module && (
                                        <p><span className="text-gray-500">@Module:</span> {material.module.replace('Module ', '')}</p>
                                    )}
                                    {material.semester && (
                                        <p><span className="text-gray-500">Semester:</span> {material.semester.replace('Semester ', '')}</p>
                                    )}
                                    {material.college_details && (
                                        <p className="line-clamp-1"><span className="text-gray-500">Details:</span> {material.college_details}</p>
                                    )}
                                </div>

                                <p className="mt-3 text-sm font-semibold text-green-700 uppercase tracking-wide">
                                    By: {material.uploader_name || "Unknown"}
                                </p>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <Button asChild size="sm" className="bg-black hover:bg-gray-800 text-white rounded-md px-4 py-1 h-8 text-xs font-medium">
                                    <Link to={`/material/${material.id}`}>
                                        View Note
                                    </Link>
                                </Button>

                                <div className="flex items-center gap-3 text-gray-400">
                                    {/* WhatsApp / Share */}
                                    <button onClick={handleShare} className="hover:text-green-600 transition-colors">
                                        <Share2 className="w-5 h-5 cursor-pointer" />
                                    </button>
                                    {/* Bookmark */}
                                    <Bookmark className="w-5 h-5 cursor-pointer hover:text-yellow-500" />

                                    {isOwner && (
                                        <button onClick={handleDelete} disabled={isDeleting} className="text-red-400 hover:text-red-600">
                                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Preview */}
                        <div className="w-24 sm:w-32 shrink-0 flex flex-col items-center justify-start pt-1">
                            <div className="w-full aspect-[3/4] bg-gray-50 border rounded-md flex items-center justify-center overflow-hidden relative shadow-inner group">

                                {isImage ? (
                                    <img
                                        src={material.file_url}
                                        alt="Preview"
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : isPDF && !pdfError ? (
                                    <div className="w-full h-full flex items-center justify-center bg-white overflow-hidden pointer-events-none">
                                        <Document
                                            file={material.file_url}
                                            onLoadError={() => setPdfError(true)}
                                            loading={
                                                <div className="flex flex-col items-center gap-1">
                                                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                                                    <span className="text-[10px] text-gray-400">Loading PDF...</span>
                                                </div>
                                            }
                                            error={<div className="text-[10px] text-red-400 flex flex-col items-center"><FileText className="w-6 h-6 mb-1" />Error</div>}
                                            className="flex justify-center items-center w-full h-full"
                                        >
                                            <Page
                                                pageNumber={1}
                                                width={140} // Approximate width of the container
                                                renderTextLayer={false}
                                                renderAnnotationLayer={false}
                                                className="shadow-sm"
                                            />
                                        </Document>
                                    </div>
                                ) : (
                                    <>
                                        <div className="absolute inset-0 bg-white p-2 flex flex-col gap-2 opacity-50">
                                            <div className="h-2 w-full bg-gray-200 rounded-sm" />
                                            <div className="h-2 w-3/4 bg-gray-200 rounded-sm" />
                                            <div className="h-2 w-full bg-gray-200 rounded-sm" />
                                            <div className="h-2 w-5/6 bg-gray-200 rounded-sm" />
                                            <div className="h-2 w-full bg-gray-200 rounded-sm" />
                                        </div>
                                        <FileText className="w-8 h-8 text-gray-400 z-10" />
                                    </>
                                )}

                            </div>
                            <p className="mt-2 text-xs text-gray-400 font-medium">
                                {dateStr}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Share Modal */}
            {
                isShareOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => setIsShareOpen(false)}
                                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">Share Material</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Share this note with your friends or classmates.
                            </p>

                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            readOnly
                                            value={material.file_url}
                                            className="w-full h-10 pl-3 pr-3 rounded-md border border-gray-200 bg-gray-50 text-sm text-gray-600 focus:outline-none"
                                        />
                                    </div>
                                    <Button
                                        onClick={handleCopyLink}
                                        className="bg-black hover:bg-gray-800 text-white min-w-[100px]"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-4 h-4 mr-2" />
                                                Copied
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4 mr-2" />
                                                Copy
                                            </>
                                        )}
                                    </Button>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <a
                                        href={`https://wa.me/?text=Check out this note: ${encodeURIComponent(material.title || 'Note')} - ${encodeURIComponent(material.file_url)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-2"
                                    >
                                        <Share2 className="w-4 h-4" /> Share on WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>
                        {/* Backdrop click to close */}
                        <div className="absolute inset-0 -z-10" onClick={() => setIsShareOpen(false)} />
                    </div>
                )
            }
        </>
    )
}
