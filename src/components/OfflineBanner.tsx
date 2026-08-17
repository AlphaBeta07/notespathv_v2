import { useState, useEffect } from 'react';

export default function OfflineBanner() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (isOnline) return null;

    return (
        <div className="bg-destructive text-destructive-foreground px-4 py-2 text-center text-sm font-medium sticky top-0 z-50 shadow-md">
            You’re offline. Previously loaded content is still available.
        </div>
    );
}
