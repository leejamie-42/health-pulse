// lib/hooks/useDemoMode.ts
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@lib/supabase/client';

export function useDemoMode() {
    const searchParams = useSearchParams();
    // Initialize state from localStorage
    const [isDemo, setIsDemo] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('demoMode') === 'true';
        }
        return false;
    });

    useEffect(() => {
        // Check if user is logged in first
        const checkAuthAndDemo = async () => {
            const supabase = createSupabaseClient();

            try {
                const { data: { user } } = await supabase.auth.getUser();

                // If user is logged in, disable demo mode
                if (user) {
                    setIsDemo(false);
                    localStorage.removeItem('demoMode');
                    return;
                }
            } catch (error) {
                // User not logged in, continue with demo mode check
                console.log('No active session, checking demo mode');
            }

            // Check localStorage FIRST before URL params
            // This ensures demo mode persists across page navigation
            const storedDemo = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';

            // Check URL param
            const demoParam = searchParams.get('demo') === 'true';

            // If URL has demo=true, set it. Otherwise, use stored value
            const demoMode = demoParam || storedDemo;
            setIsDemo(demoMode);

            // Persist to localStorage when demo param is in URL
            if (demoParam) {
                localStorage.setItem('demoMode', 'true');
            }
        };

        checkAuthAndDemo();
    }, [searchParams]);

    const exitDemoMode = () => {
        setIsDemo(false);
        localStorage.removeItem('demoMode');
    };

    return { isDemo, exitDemoMode };
}