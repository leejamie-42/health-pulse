// app/dashboard/AuthWrapper.tsx
'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseClient } from '@lib/supabase/client';

function AuthCheck({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isChecking, setIsChecking] = useState(true);
    const [isDemoMode, setIsDemoMode] = useState(false);

    useEffect(() => {
        const checkAuthOrDemo = async () => {
            // Check if demo mode is active (from URL or localStorage)
            const demoFromUrl = searchParams.get('demo') === 'true';
            const demoFromStorage = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';
            const isDemo = demoFromUrl || demoFromStorage;

            if (isDemo) {
                setIsDemoMode(true);
                setIsChecking(false);
                return;
            }

            // Check auth for non-demo users
            const supabase = createSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login?reason=auth-required');
            } else {
                setIsChecking(false);
            }
        };

        checkAuthOrDemo();
    }, [searchParams, router]);

    // Show loading state while checking auth
    if (isChecking && !isDemoMode) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return <>{children}</>;
}

export function AuthWrapper({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        }>
            <AuthCheck>{children}</AuthCheck>
        </Suspense>
    );
}