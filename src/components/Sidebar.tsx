// components/Sidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Calendar, Target, Dumbbell, TrendingUp, LogOut, SquareActivity } from 'lucide-react';
import { useDemoMode } from '@lib/hooks/useDemoMode';
import { createSupabaseClient } from '@lib/supabase/client';

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { isDemo, exitDemoMode } = useDemoMode();

    const navItems = [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/daily-log', icon: Calendar, label: 'Daily Log' },
        { href: '/goals', icon: Target, label: 'Goals' },
        // { href: '/workouts', icon: Dumbbell, label: 'Workouts' },
        { href: '/progress', icon: TrendingUp, label: 'Progress' },
    ];

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
    }
    return (
        <aside className="bg-base-100 w-64 min-h-full border-r border-white/10 backdrop-blur-sm shadow-lg">
            <div className="p-4 flex items-center gap-2">
                <div className="rounded-full bg-primary p-2">
                    <SquareActivity className="h-6 w-6 text-primary-content" />
                </div>
                <span className="text-xl font-bold">HealthPulse</span>
            </div>

            <ul className="menu p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`rounded-lg ${isActive ? 'active' : ''}`}
                            >
                                <Icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <div className="absolute bottom-4 left-4 right-4">
                <button
                    onClick={handleLogout}
                    className="btn btn-ghost w-full justify-start rounded-lg mt-auto mx-4 mb-4">
                    <LogOut className="h-5 w-5 mr-2" />
                    {isDemo ? 'Exit Demo' : 'Logout'}
                </button>
            </div>
        </aside>
    );
}