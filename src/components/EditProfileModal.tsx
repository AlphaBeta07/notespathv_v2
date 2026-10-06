import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, Camera } from 'lucide-react'

import { User } from '@supabase/supabase-js'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'

interface EditProfileModalProps {
    isOpen: boolean
    onClose: () => void
    user: User
}

export function EditProfileModal({ isOpen, onClose, user }: EditProfileModalProps) {
    const currentUsername = user.user_metadata?.username || user.email?.split('@')[0] || ''
    const currentAvatar = user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.email}&gender=male`

    const [username, setUsername] = useState(currentUsername)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string>(currentAvatar)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            
            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
            if (!validTypes.includes(file.type)) {
                setError('Please select a JPG, PNG, or WebP image.')
                return
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size must be less than 5MB.')
                return
            }

            setError(null)
            setAvatarFile(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const handleSave = async () => {
        setError(null)
        const trimmedUsername = username.trim()

        if (!trimmedUsername) {
            setError('Username cannot be empty.')
            return
        }

        setLoading(true)

        try {
            const formData = new FormData()
            formData.append('username', trimmedUsername)
            if (avatarFile) formData.append('file', avatarFile)

            const res = await fetch('/api/auth/update-profile', {
                method: 'POST',
                body: formData
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || 'Failed to update profile')
            }

            // Force reload to update auth context
            window.location.reload()
            
            onClose()
        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Failed to update profile.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
                        onClick={!loading ? onClose : undefined}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="bg-white/90 backdrop-blur-xl border border-white rounded-3xl p-6 md:p-8 shadow-2xl shadow-blue-900/10 w-full max-w-md pointer-events-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Edit Profile</h2>
                                <button 
                                    onClick={!loading ? onClose : undefined}
                                    className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors outline-none"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-6">
                                {/* Profile Picture */}
                                <div className="flex flex-col items-center">
                                    <p className="text-sm font-medium text-gray-700 mb-3 w-full">Profile Picture</p>
                                    
                                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md ring-1 ring-gray-200">
                                            <Avatar className="w-full h-full">
                                                <AvatarImage src={previewUrl} className="object-cover" />
                                                <AvatarFallback className="text-2xl bg-blue-50 text-blue-600 font-bold">
                                                    {username.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        
                                        <div className="absolute inset-1 rounded-full bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="w-6 h-6 text-white mb-1" />
                                            <span className="text-white text-[10px] font-medium">Change</span>
                                        </div>
                                    </div>
                                    
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        className="hidden" 
                                        accept="image/jpeg,image/png,image/webp,image/jpg"
                                        onChange={handleFileChange}
                                    />
                                    
                                    <button 
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="mt-3 text-sm text-blue-600 font-medium hover:text-blue-700 hover:underline"
                                    >
                                        Change Photo
                                    </button>
                                </div>

                                {/* Username */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Username
                                    </label>
                                    <Input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full h-11 bg-white"
                                        placeholder="Enter your username"
                                        disabled={loading}
                                    />
                                </div>

                                {/* Email (Read Only) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <Input
                                        type="email"
                                        value={user.email || ''}
                                        readOnly
                                        disabled
                                        className="w-full h-11 bg-gray-50/80 text-gray-500 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-400 mt-1.5 ml-1">Email cannot be changed here.</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-8">
                                <Button
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={loading}
                                    className="flex-1 h-11 rounded-xl bg-white/50 border-gray-200"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}
