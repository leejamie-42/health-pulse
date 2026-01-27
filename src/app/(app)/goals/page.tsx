// app/goals/page.tsx
'use client';
import { useState, useEffect, Suspense } from 'react';
import { Target, Plus, Check, TrendingUp, XCircle, Clock } from 'lucide-react';
import { AuthWrapper } from '../dashboard/AuthWrapper';
import { SidebarWrapper } from '@components/SidebarWrapper';
import { TopNavWrapper } from '@components/TopNavWrapper';
import { GoalCard } from '@components/GoalCard';
import { CreateGoalModal } from '@components/CreateGoalModal';
import { useDemoMode } from '@lib/hooks/useDemoMode';
import { getGoals, createGoal, updateGoal, deleteGoal, type Goal } from '@lib/data/goals';

export const dynamic = 'force-dynamic';

function GoalsPageContent() {
    const { isDemo } = useDemoMode();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        target_value: '',
        current_value: '',
        unit: '',
        start_date: '',
        deadline_date: '',
        status: 'not_started' as 'active' | 'completed' | 'paused' | 'not_started' | 'failed'
    });

    useEffect(() => {
        loadGoals();
    }, [isDemo]);

    const loadGoals = async () => {
        try {
            setLoading(true);
            const data = await getGoals(isDemo);
            setGoals(data);
        } catch (err) {
            console.error('Error loading goals:', err);
            if (!isDemo) {
                setError('Failed to load goals');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isDemo) {
            setError('Cannot modify goals in demo mode');
            setTimeout(() => setError(''), 3000);
            return;
        }

        try {
            const goalData = {
                name: formData.name,
                target_value: parseFloat(formData.target_value),
                current_value: parseFloat(formData.current_value || '0'),
                unit: formData.unit,
                start_date: formData.start_date || null,
                deadline_date: formData.deadline_date || null,
                status: formData.status
            };

            if (editingGoal) {
                await updateGoal(editingGoal.id, goalData, isDemo);
                setSuccess('Goal updated successfully!');
            } else {
                await createGoal(goalData, isDemo);
                setSuccess('Goal created successfully!');
            }

            resetForm();
            loadGoals();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to save goal');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleEdit = (goal: Goal) => {
        setEditingGoal(goal);
        setFormData({
            name: goal.name,
            target_value: goal.target_value.toString(),
            current_value: goal.current_value.toString(),
            unit: goal.unit,
            start_date: goal.start_date || '',
            deadline_date: goal.deadline_date || '',
            status: goal.status
        });
        setShowCreateModal(true);
    };

    const handleDelete = async (goalId: number) => {
        if (isDemo) {
            setError('Cannot delete goals in demo mode');
            setTimeout(() => setError(''), 3000);
            return;
        }

        if (!confirm('Are you sure you want to delete this goal?')) return;

        try {
            await deleteGoal(goalId, isDemo);
            setSuccess('Goal deleted successfully!');
            loadGoals();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to delete goal');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleStatusChange = async (goal: Goal, newStatus: 'active' | 'completed' | 'paused' | 'not_started' | 'failed') => {
        if (isDemo) {
            setError('Cannot update goal status in demo mode');
            setTimeout(() => setError(''), 3000);
            return;
        }

        try {
            await updateGoal(goal.id, { status: newStatus }, isDemo);
            setSuccess(`Goal marked as ${newStatus.replace('_', ' ')}!`);
            loadGoals();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to update status');
            setTimeout(() => setError(''), 3000);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            target_value: '',
            current_value: '',
            unit: '',
            start_date: '',
            deadline_date: '',
            status: 'not_started'
        });
        setEditingGoal(null);
        setShowCreateModal(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    const notStartedGoals = goals.filter(g => g.status === 'not_started');
    const activeGoals = goals.filter(g => g.status === 'active');
    const completedGoals = goals.filter(g => g.status === 'completed');
    const pausedGoals = goals.filter(g => g.status === 'paused');
    const failedGoals = goals.filter(g => g.status === 'failed');

    return (
        <AuthWrapper>
            <div className="min-h-screen bg-base-200">
                <div className="drawer lg:drawer-open">
                    <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />

                    <div className="drawer-content flex flex-col">
                        <TopNavWrapper isDemo={isDemo} />

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

                                {/* Notifications */}
                                {error && (
                                    <div className="alert alert-error mb-6 shadow-lg">
                                        <span>{error}</span>
                                    </div>
                                )}

                                {success && (
                                    <div className="alert alert-success mb-6 shadow-lg">
                                        <span>{success}</span>
                                    </div>
                                )}

                                {/* Header */}
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h1 className="text-3xl font-bold mb-2">My Goals</h1>
                                        <p className="text-base-content opacity-70">
                                            Track and manage your health & fitness goals
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowCreateModal(true)}
                                        className="btn btn-primary gap-2"
                                    >
                                        <Plus className="h-5 w-5" />
                                        New Goal
                                    </button>
                                </div>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                                    <div className="card bg-base-100 shadow-lg">
                                        <div className="card-body py-4">
                                            <h3 className="text-xs opacity-70">Not Started</h3>
                                            <p className="text-2xl font-bold">{notStartedGoals.length}</p>
                                        </div>
                                    </div>
                                    <div className="card bg-info text-primary-content shadow-lg">
                                        <div className="card-body py-4">
                                            <h3 className="text-xs opacity-80">Active</h3>
                                            <p className="text-2xl font-bold">{activeGoals.length}</p>
                                        </div>
                                    </div>
                                    <div className="card bg-success text-success-content shadow-lg">
                                        <div className="card-body py-4">
                                            <h3 className="text-xs opacity-80">Completed</h3>
                                            <p className="text-2xl font-bold">{completedGoals.length}</p>
                                        </div>
                                    </div>
                                    <div className="card bg-warning text-warning-content shadow-lg">
                                        <div className="card-body py-4">
                                            <h3 className="text-xs opacity-80">Paused</h3>
                                            <p className="text-2xl font-bold">{pausedGoals.length}</p>
                                        </div>
                                    </div>
                                    <div className="card bg-error text-error-content shadow-lg">
                                        <div className="card-body py-4">
                                            <h3 className="text-xs opacity-80">Failed</h3>
                                            <p className="text-2xl font-bold">{failedGoals.length}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Not Started Goals */}
                                {notStartedGoals.length > 0 && (
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                            <Clock className="h-6 w-6 text-base-content opacity-70" />
                                            Not Started
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {notStartedGoals.map(goal => (
                                                <GoalCard
                                                    key={goal.id}
                                                    goal={goal}
                                                    onEdit={handleEdit}
                                                    onDelete={handleDelete}
                                                    onStatusChange={handleStatusChange}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Active Goals */}
                                {activeGoals.length > 0 && (
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                            <Target className="h-6 w-6 text-primary" />
                                            Active Goals
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {activeGoals.map(goal => (
                                                <GoalCard
                                                    key={goal.id}
                                                    goal={goal}
                                                    onEdit={handleEdit}
                                                    onDelete={handleDelete}
                                                    onStatusChange={handleStatusChange}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Paused Goals */}
                                {pausedGoals.length > 0 && (
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                            <TrendingUp className="h-6 w-6 text-warning" />
                                            Paused Goals
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {pausedGoals.map(goal => (
                                                <GoalCard
                                                    key={goal.id}
                                                    goal={goal}
                                                    onEdit={handleEdit}
                                                    onDelete={handleDelete}
                                                    onStatusChange={handleStatusChange}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Completed Goals */}
                                {completedGoals.length > 0 && (
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                            <Check className="h-6 w-6 text-success" />
                                            Completed Goals
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {completedGoals.map(goal => (
                                                <GoalCard
                                                    key={goal.id}
                                                    goal={goal}
                                                    onEdit={handleEdit}
                                                    onDelete={handleDelete}
                                                    onStatusChange={handleStatusChange}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Failed Goals */}
                                {failedGoals.length > 0 && (
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                            <XCircle className="h-6 w-6 text-error" />
                                            Failed Goals
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {failedGoals.map(goal => (
                                                <GoalCard
                                                    key={goal.id}
                                                    goal={goal}
                                                    onEdit={handleEdit}
                                                    onDelete={handleDelete}
                                                    onStatusChange={handleStatusChange}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Empty State */}
                                {goals.length === 0 && (
                                    <div className="card bg-base-100 shadow-lg">
                                        <div className="card-body items-center text-center py-16">
                                            <Target className="h-16 w-16 text-base-content opacity-20 mb-4" />
                                            <h3 className="text-xl font-bold mb-2">No goals yet</h3>
                                            <p className="text-base-content opacity-70 mb-6">
                                                Start by creating your first health goal
                                            </p>
                                            <button
                                                onClick={() => setShowCreateModal(true)}
                                                className="btn btn-primary gap-2"
                                            >
                                                <Plus className="h-5 w-5" />
                                                Create Your First Goal
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="drawer-side">
                        <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
                        <SidebarWrapper />
                    </div>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <CreateGoalModal
                isOpen={showCreateModal}
                onClose={resetForm}
                onSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                editingGoal={editingGoal}
            />
        </AuthWrapper>
    );
}

export default function GoalsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        }>
            <AuthWrapper>
                <GoalsPageContent />
            </AuthWrapper>
        </Suspense>
    );
}