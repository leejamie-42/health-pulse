// app/dashboard/AuthWrapper.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isChecking, setIsChecking] = useState(true);
    const isDemo = searchParams.get('demo') === 'true';

    useEffect(() => {
        // Skip auth check if in demo mode
        if (isDemo) {
            setIsChecking(false);
            return;
        }

        // Check auth for non-demo users
        const checkAuth = async () => {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login?reason=auth-required');
            } else {
                setIsChecking(false);
            }
        };

        checkAuth();
    }, [isDemo, router]);

    // Show loading state while checking auth
    if (isChecking && !isDemo) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return <>{children}</>;
}