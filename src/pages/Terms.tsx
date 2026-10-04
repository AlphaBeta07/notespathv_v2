import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { DotBackground } from '../components/DotBackground'

export default function Terms() {
    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden font-sans bg-slate-50/50">
            <DotBackground />
            
            {/* Header */}
            <header className="fixed top-0 left-0 w-full z-20 p-4 md:p-6 bg-white/60 backdrop-blur-md border-b border-gray-200/50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors px-3 py-1.5 rounded-full hover:bg-gray-100/80">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-medium text-sm">Back to Home</span>
                    </Link>
                    <span className="font-bold text-lg tracking-tight text-gray-900">
                        Notes<span className="text-blue-600">Pathv</span>
                    </span>
                </div>
            </header>

            <main className="flex-1 w-full max-w-4xl mx-auto py-32 px-4 md:px-8 relative z-10">
                <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-8 md:p-12 shadow-xl shadow-gray-200/50">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Terms and Conditions</h1>
                    <p className="text-gray-500 mb-10 text-sm">Last updated: {new Date().toLocaleDateString()}</p>

                    <div className="space-y-8 text-gray-700 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
                            <p>
                                Welcome to NotesPathv ("we," "our," or "us"). These Terms and Conditions govern your use of our website and services. By accessing or using NotesPathv, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access the service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Description of Service</h2>
                            <p>
                                NotesPathv is an educational platform designed to empower students by allowing them to share, discover, and learn from academic notes, study materials, and engineering resources.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">3. User Accounts</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>You must be a student or educator to use this platform.</li>
                                <li>You are responsible for safeguarding the password that you use to access the service.</li>
                                <li>You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Content and Intellectual Property</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Your Content:</strong> You retain all rights and ownership to the notes and materials you upload. By uploading content, you grant NotesPathv a non-exclusive, worldwide, royalty-free license to use, reproduce, and display the content solely for the purpose of operating and improving the platform.</li>
                                <li><strong>Prohibited Content:</strong> You agree not to upload copyrighted materials (such as textbooks or paid resources) unless you have explicit permission from the copyright owner. Plagiarism, offensive content, and spam are strictly prohibited.</li>
                                <li><strong>Takedown:</strong> We reserve the right to remove any content that violates these Terms or is deemed inappropriate without prior notice.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">5. User Conduct</h2>
                            <p>
                                You agree to use NotesPathv only for lawful educational purposes. You must not use the platform in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of NotesPathv.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Disclaimer of Warranties</h2>
                            <p>
                                The materials on NotesPathv are provided on an 'as is' basis. NotesPathv makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property. Furthermore, we do not warrant the accuracy or completeness of the study materials uploaded by users.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Limitation of Liability</h2>
                            <p>
                                In no event shall NotesPathv or its developers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the platform.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Changes to Terms</h2>
                            <p>
                                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion. We encourage users to frequently check this page for any changes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Contact Us</h2>
                            <p>
                                If you have any questions about these Terms, please contact the developer at anishlandage.fun.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    )
}
