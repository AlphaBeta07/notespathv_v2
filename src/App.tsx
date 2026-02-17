import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedLayout from './components/ProtectedLayout'
import LandingPage from './pages/Landing'
import AuthPage from './pages/Auth'

import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import Profile from './pages/Profile'
import ViewMaterial from './pages/ViewMaterial'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { session, loading } = useAuth()
    if (loading) return <div>Loading...</div>
    if (!session) return <Navigate to="/auth" />
    return <>{children}</>
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth" element={<AuthPage />} />

                    <Route element={<ProtectedLayout />}>
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    </Route>

                    <Route path="/material/:id" element={<ViewMaterial />} />

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </AuthProvider>
        </Router>
    )
}

export default App
