// components/TopNav.tsx
'use client';
import { User } from 'lucide-react';
import Link from 'next/link';
import { ThemeController } from "./ThemeController";

export function TopNav() {
    return (
        <div className="navbar bg-base-100 border-b border-white/10 shadow-lg backdrop-blur-sm">
            <div className="flex-1">
                <label htmlFor="sidebar-drawer" className="btn btn-ghost drawer-button lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </label>
                <span className="text-xl font-bold lg:hidden">HealthPulse</span>
            </div>
            <div className="flex items-center gap-2">
                <ThemeController />
                <details className="dropdown dropdown-end">
                    <summary className="btn btn-circle btn-ghost"><User /></summary>
                    <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                        <li><Link href="/profile">Profile</Link></li>
                        <li><Link href="/">Logout</Link></li>
                    </ul>
                </details>
            </div>
        </div >
    );
}
