// components/TopNav.tsx
'use client';
import { User } from 'lucide-react';
import Link from 'next/link';
import { ThemeController } from "./ThemeController";

import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@lib/supabase/client';
import { useRouter } from 'next/navigation';

export function TopNav() {
    const router = useRouter();
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        const supabase = createSupabaseClient();
        supabase.auth.getUser().then(({ data }) => {
            setEmail(data.user?.email ?? null);
        });
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };


    return (
        <div className="navbar bg-base-100 border-b border-white/10 shadow-lg backdrop-blur-sm">
            <div className="flex-1">
                <label htmlFor="sidebar-drawer" className="btn btn-ghost drawer-button lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </label>
                <span className="text-xl font-bold lg:hidden">HealthPulse</span>
                {/* auth sanity check */}
                {email ? (
                    <span className="text-sm opacity-70">{email}</span>
                ) : (
                    <span className="text-sm text-error">not signed in</span>
                )}
            </div>
            <div className="flex items-center gap-2">
                <ThemeController />
                <details className="dropdown dropdown-end">
                    <summary className="btn btn-circle btn-ghost"><User /></summary>
                    <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                        <li><Link href="/profile">Profile</Link></li>
                        <li><button onClick={handleLogout}>Logout</button></li>
                    </ul>
                </details>
            </div>
        </div >
    );
}
