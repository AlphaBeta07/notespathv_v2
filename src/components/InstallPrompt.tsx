import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Download, X } from 'lucide-react';

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };
        
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            setShowPrompt(false);
        }
        setDeferredPrompt(null);
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-card border shadow-lg rounded-xl p-4 flex items-center justify-between z-50">
            <div className="text-sm font-medium text-card-foreground">
                Install NotesPathv App
            </div>
            <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleInstall} className="flex items-center gap-2">
                    <Download className="w-4 h-4" /> Install
                </Button>
                <button 
                    onClick={() => setShowPrompt(false)}
                    className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
