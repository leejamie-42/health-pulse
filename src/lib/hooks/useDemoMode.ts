// lib/hooks/useDemoMode.ts
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useDemoMode() {
    const searchParams = useSearchParams();
    const [isDemo, setIsDemo] = useState(false);

    useEffect(() => {
        // Check URL param first
        const demoParam = searchParams.get('demo') == 'true';

        // Check localStorage for persisted demo state
        const storedDemo = localStorage.getItem('demoMode') == 'true';

        const demoMode = demoParam || storedDemo;
        setIsDemo(demoMode);

        // Persist to localStorage
        if (demoMode) {
            localStorage.setItem('demoMode', 'true');
        }
    }, [searchParams]);

    const exitDemoMode = () => {
        setIsDemo(false);
        localStorage.removeItem('demoMode');
    };

    return { isDemo, exitDemoMode };
}