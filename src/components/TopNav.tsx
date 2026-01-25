// components/TopNav.tsx
'use client';
import { User } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

import { useRef, useEffect, useState } from 'react';
import { ThemeController } from "./ThemeController";
import { useUserProfile } from '@lib/hooks/useUserProfile';
import { createSupabaseClient } from '@lib/supabase/client';
import { useDemoMode } from '@lib/hooks/useDemoMode';

interface TopNavProps {
    isDemo?: boolean;
}

export function TopNav({ isDemo = false }: TopNavProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { exitDemoMode } = useDemoMode();
    const { username, avatarUrl } = useUserProfile(isDemo);

    const showUserMenu = pathname != '/';

    const handleLogout = async () => {
        if (isDemo) {
            exitDemoMode();
            router.push('/');
            return;
        }

        const supabase = createSupabaseClient();
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };


    return (
        <div className="navbar bg-base-100 border-b border-white/10 shadow-lg backdrop-blur-sm">
            <div className="flex-1">
                {showUserMenu && (
                    <label htmlFor="sidebar-drawer" className="btn btn-ghost drawer-button lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </label>
                )}
                <span className="text-xl font-bold">HealthPulse</span>
            </div>
            <div className="flex items-center gap-2">
                <ThemeController />
                {showUserMenu && (
                    <details className="dropdown dropdown-end">
                        <summary className="btn btn-circle btn-ghost">
                            {avatarUrl ? (
                                <div className="avatar">
                                    <div className="w-10 rounded-full">
                                        <img src={avatarUrl} alt={username || 'User'} />
                                    </div>
                                </div>
                            ) : (
                                <User />
                            )}
                        </summary>
                        <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-lg mt-3 border border-base-300">
                            {<li><Link href="/profile">Profile</Link></li>}
                            <li><button onClick={handleLogout}>{isDemo ? 'Exit Demo' : 'Logout'}</button></li>
                        </ul>
                    </details>
                )}
            </div>
        </div >
    );
}
