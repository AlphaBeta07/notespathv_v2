import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button } from './ui/button'
import { RefreshCw, X } from 'lucide-react'

export default function PWAReloadPrompt() {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r: any) {
            console.log('SW Registered: ' + r)
        },
        onRegisterError(error: any) {
            console.log('SW registration error', error)
        },
    })

    const close = () => {
        setOfflineReady(false)
        setNeedRefresh(false)
    }

    if (!offlineReady && !needRefresh) return null

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-card border shadow-lg rounded-xl p-4 z-50 animate-in slide-in-from-bottom-5">
            <div className="flex justify-between items-start mb-3">
                <div className="text-sm font-medium text-card-foreground">
                    {offlineReady
                        ? <span>App ready to work offline</span>
                        : <span>New content available, click on reload button to update.</span>}
                </div>
                <button 
                    onClick={close} 
                    className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors -mt-1 -mr-1"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
            {needRefresh && (
                <Button size="sm" onClick={() => updateServiceWorker(true)} className="w-full flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Reload
                </Button>
            )}
        </div>
    )
}
