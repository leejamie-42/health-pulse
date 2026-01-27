// components/SidebarWrapper.tsx
'use client';
import { Suspense } from 'react';
import { Sidebar } from './Sidebar';

export function SidebarWrapper() {
    return (
        <Suspense fallback={
            <aside className="bg-base-100 min-h-full border-r border-white/10 shadow-lg backdrop-blur-sm w-80 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </aside>
        }>
            <Sidebar />
        </Suspense>
    );
}