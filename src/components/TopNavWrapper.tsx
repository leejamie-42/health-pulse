// components/TopNavWrapper.tsx
'use client';
import { Suspense } from 'react';
import { TopNav } from './TopNav';

interface TopNavWrapperProps {
    isDemo?: boolean;
}

export function TopNavWrapper({ isDemo = false }: TopNavWrapperProps) {
    return (
        <Suspense fallback={
            <div className="navbar bg-base-100 border-b border-white/10 shadow-lg backdrop-blur-sm">
                <span className="loading loading-spinner loading-sm"></span>
            </div>
        }>
            <TopNav isDemo={isDemo} />
        </Suspense>
    );
}