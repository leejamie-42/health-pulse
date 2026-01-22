// (app)/dashboard/page.tsx
'use client';
import { useSearchParams } from 'next/navigation';
import { getDashboardData } from '@lib/data/dashboard';
import { useState, useEffect } from 'react';

import Link from 'next/link';
import { Target, Activity, Flame, Droplets, TrendingUp, TrendingDown, Plus, Calendar } from 'lucide-react';
import { Sidebar } from '@components/Sidebar';
import { TopNav } from '@components/TopNav';
import { GoalProgressCard, type Goal } from "@components/GoalProgressCard";
import { StatCard } from "@components/StatCard";
import { AuthWrapper } from './AuthWrapper';

export default function DashboardPage() {
    const searchParams = useSearchParams();
    const isDemo = searchParams.get('demo') == 'true';

    // // dummy data
    // const stats = {
    //     activeGoals: 3,
    //     weeklyWorkouts: 85,
    //     avgCalories: 2150,
    //     waterTrend: -12,
    // };
    // const recentGoals = [
    //     { id: 1, name: 'Lose 10 kg', progress: 65, target: '10 kg', current: '6.5 kg' },
    //     { id: 2, name: 'Daily 10k steps', progress: 78, target: '10,000', current: '7,800' },
    //     { id: 3, name: 'Protein 150g/day', progress: 92, target: '150g', current: '138g' },
    // ];

    const [goals, setGoals] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getDashboardData(isDemo)
            .then(({ goals, stats }) => {
                setGoals(goals ?? []);
                setStats(stats);
            })
            .catch((error) => {
                console.error('Error loading dashboard data:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [isDemo]);

    if (loading || !stats) {
        return (
            <AuthWrapper>
                <div className="min-h-screen bg-base-200 flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </AuthWrapper>
        );
    }


    const isPositive = stats?.waterTrend >= 0;
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;
    const TrendColor = isPositive ? 'text-success' : 'text-error';



    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };


    return (
        <AuthWrapper>
            <div className="min-h-screen bg-base-200">
                <div className="drawer lg:drawer-open">
                    {/* Sidebar */}
                    <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />

                    {/* Main Content Area */}
                    <div className="drawer-content flex flex-col">
                        <TopNav />

                        {/* Page Content */}
                        <div className="flex-1 p-4 lg:p-6">
                            <div className="max-w-7xl mx-auto">
                                {/* Demo Banner */}
                                {isDemo && (
                                    <div className="alert bg-yellow-400 alert-info rounded-lg mb-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <span>Demo mode — changes are not saved</span>
                                    </div>
                                )}

                                {/* Welcome Header */}
                                <div className="mb-8">
                                    <h1 className="text-3xl font-bold mb-2">{getGreeting()}, Alex</h1>
                                    <p className="text-base-content opacity-70">Here's your health overview</p>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                    <StatCard label="Active Goals" value={stats.activeGoals} icon={Target} color="bg-primary" iconColor="text-white" />
                                    <StatCard label="Weekly Workouts" value={`${stats.weeklyWorkouts}%`} icon={Activity} color="bg-secondary" iconColor="text-white" />
                                    <StatCard label="Avg Calories (7d)" value={stats.avgCalories} icon={Flame} color="bg-accent" iconColor="text-white" />
                                    <div className="card bg-base-100 shadow-lg">
                                        <div className="card-body">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-base-content opacity-70 text-sm">Water Trend</p>
                                                    <p className="text-3xl font-bold mt-2 flex items-center gap-1">
                                                        <TrendIcon className="h-6 w-6 ${trendColor}" />
                                                        {stats.waterTrend}%
                                                    </p>
                                                </div>
                                                <div className="rounded-lg bg-info bg-opacity-10 p-3">
                                                    <Droplets className="h-6 w-6 text-info text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                    <Link href="/daily-log" className="card bg-gradient-to-br from-primary to-primary-focus hover:shadow-xl transition-shadow">
                                        <div className="card-body flex-row items-center justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold text-primary-content">Log Today's Metrics</h3>
                                                <p className="text-primary-content opacity-80">Track your daily progress</p>
                                            </div>
                                            <Calendar className="h-10 w-10 text-primary-content" />
                                        </div>
                                    </Link>

                                    <Link href="/goals" className="card bg-gradient-to-br from-secondary to-secondary-focus hover:shadow-xl transition-shadow">
                                        <div className="card-body flex-row items-center justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold text-secondary-content">Create New Goal</h3>
                                                <p className="text-secondary-content opacity-80">Set a new target to achieve</p>
                                            </div>
                                            <Plus className="h-10 w-10 text-secondary-content" />
                                        </div>
                                    </Link>
                                </div>

                                {/* Active Goals */}
                                <div className="card bg-base-100 shadow-lg">
                                    <div className="card-body">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="card-title text-2xl">Active Goals</h2>
                                            <Link href="/goals" className="btn btn-sm btn-ghost rounded-lg">
                                                View All
                                            </Link>
                                        </div>

                                        <div className="space-y-4">
                                            {goals.length > 0 ? (
                                                goals.map((goal) => (
                                                    <GoalProgressCard key={goal.id} goal={goal} />
                                                ))
                                            ) : (
                                                <p className="text-center text-base-content opacity-70 py-8">
                                                    No active goals yet. Create one to get started!
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="drawer-side">
                        <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
                        <Sidebar />
                    </div>
                </div>
            </div>
        </AuthWrapper>
    );
}