// lib/hooks/useDemoMode.ts
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@lib/supabase/client';

// Internal hook that uses useSearchParams
function useDemoModeInternal() {
    const searchParams = useSearchParams();
    const [isDemo, setIsDemo] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('demoMode') === 'true';
        }
        return false;
    });

    useEffect(() => {
        const checkAuthAndDemo = async () => {
            const supabase = createSupabaseClient();

            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    setIsDemo(false);
                    localStorage.removeItem('demoMode');
                    return;
                }
            } catch (error) {
                console.log('No active session, checking demo mode');
            }

            const storedDemo = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';
            const demoParam = searchParams.get('demo') === 'true';
            const demoMode = demoParam || storedDemo;
            setIsDemo(demoMode);

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

// Export this as the main hook
export const useDemoMode = useDemoModeInternal;