import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Material } from '../types'
import { MaterialCard } from '../components/MaterialCard'
import { Button } from '../components/ui/button'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
    const [materials, setMaterials] = useState<Material[]>([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    useEffect(() => {
        fetchMaterials()
    }, [user])

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
        } catch (error) {
            console.error('Error fetching materials:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Manage and view your uploaded materials.
                    </p>
                </div>
                <Link to="/upload">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Upload New
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-[300px] rounded-lg border bg-muted animate-pulse"></div>
                    ))}
                </div>
            ) : materials.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {materials.map((material) => (
                        <MaterialCard key={material.id} material={material} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
                    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                        <h3 className="mt-4 text-lg font-semibold">No materials found</h3>
                        <p className="mb-4 mt-2 text-sm text-muted-foreground">
                            You haven't uploaded any materials yet.
                        </p>
                        <Link to="/upload">
                            <Button variant="outline">Upload your first material</Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
