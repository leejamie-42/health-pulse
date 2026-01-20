'use client';
import { useState } from 'react';
import { Plus, Target, Check } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { TopNav } from '../../components/TopNav';
import { ActiveGoalCard, type ActiveGoal } from '../../components/goals/ActiveGoalCard';
import { CompletedGoalCard, type CompletedGoal } from '../../components/goals/CompletedGoalCard';
import { CreateGoalModal } from '../../components/goals/CreateGoalModal';

export default function GoalsPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);

    const activeGoals: ActiveGoal[] = [
        {
            id: 1,
            name: 'Lose 10 lbs',
            type: 'Weight Loss',
            progress: 65,
            target: '10 lbs',
            current: '6.5 lbs',
            startDate: '2025-01-01',
            endDate: '2025-03-31',
        },
        {
            id: 2,
            name: 'Daily 10k steps',
            type: 'Activity',
            progress: 78,
            target: '10,000 steps',
            current: '7,800 avg',
            startDate: '2025-01-01',
            endDate: '2025-12-31',
        },
        {
            id: 3,
            name: 'Protein 150g/day',
            type: 'Nutrition',
            progress: 92,
            target: '150g',
            current: '138g avg',
            startDate: '2025-01-15',
            endDate: '2025-06-15',
        },
    ];

    const completedGoals: CompletedGoal[] = [
        {
            id: 4,
            name: 'Run 5K under 30 min',
            type: 'Fitness',
            completedDate: '2024-12-20',
        },
    ];

    return (
        <div className="min-h-screen bg-base-200">
            <div className="drawer lg:drawer-open">
                <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />

                {/* Main Content Area */}
                <div className="drawer-content flex flex-col">
                    <TopNav />

                    {/* Page Content */}
                    <div className="flex-1 p-4 lg:p-6">
                        <div className="max-w-6xl mx-auto">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h1 className="text-3xl font-bold mb-2">Goals</h1>
                                    <p className="text-base-content opacity-70">Track your health and fitness targets</p>
                                </div>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="btn btn-primary rounded-lg gap-2"
                                >
                                    <Plus className="h-5 w-5" />
                                    Create Goal
                                </button>
                            </div>

                            {/* Active Goals Section */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <Target className="h-6 w-6 text-primary" />
                                    Active Goals
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {activeGoals.map((goal) => (
                                        <ActiveGoalCard key={goal.id} goal={goal} />
                                    ))}
                                </div>
                            </div>

                            {/* Completed Goals Section */}
                            <div>
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <Check className="h-6 w-6 text-success" />
                                    Completed Goals
                                </h2>

                                <div className="space-y-3">
                                    {completedGoals.map((goal) => (
                                        <CompletedGoalCard key={goal.id} goal={goal} />
                                    ))}
                                </div>
                            </div>

                            {/* Create Goal Modal */}
                            <CreateGoalModal
                                isOpen={showCreateModal}
                                onClose={() => setShowCreateModal(false)}
                            />
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
    );
}