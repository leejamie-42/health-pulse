// app/daily-log/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Plus, Calendar, TrendingUp, Activity, Flame } from 'lucide-react';
import { AuthWrapper } from '../dashboard/AuthWrapper';
import { Sidebar } from '@components/Sidebar';
import { TopNav } from '@components/TopNav';
import { DailyLogForm } from '@components/DailyLogForm';
import { DailyLogCard } from '@components/DailyLogCard';
import { useDemoMode } from '@lib/hooks/useDemoMode';
import { getDailyLogs, getDailyLogByDate, createDailyLog, updateDailyLog, deleteDailyLog, getRecentLogs, type DailyLog } from '@lib/data/dailyLogs';

export default function DailyLogPage() {
    const { isDemo } = useDemoMode();
    const [logs, setLogs] = useState<DailyLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingLog, setEditingLog] = useState<DailyLog | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        log_date: new Date().toISOString().split('T')[0],
        workout_completed: false,
        workout_time_minutes: '',
        steps: '',
        calories_consumed: '',
        protein_intake_g: '',
        water_ml: '',
        weight_kg: '',
        sleep_hours: '',
        mood_rating: '3',
        energy_level: '3',
        notes: ''
    });

    useEffect(() => {
        loadLogs();
    }, [isDemo]);

    const loadLogs = async () => {
        try {
            setLoading(true);
            const data = await getDailyLogs(isDemo, 30);
            setLogs(data);
        } catch (err) {
            console.error('Error loading logs:', err);
            if (!isDemo) {
                setError('Failed to load logs');
                setTimeout(() => setError(''), 3000);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isDemo) {
            setError('Cannot modify logs in demo mode');
            setTimeout(() => setError(''), 3000);
            return;
        }

        setSaving(true);
        setError('');

        try {
            const logData = {
                log_date: formData.log_date,
                workout_completed: formData.workout_completed,
                workout_time_minutes: formData.workout_time_minutes ? parseInt(formData.workout_time_minutes) : null,
                steps: formData.steps ? parseInt(formData.steps) : null,
                calories_consumed: formData.calories_consumed ? parseInt(formData.calories_consumed) : null,
                protein_intake_g: formData.protein_intake_g ? parseFloat(formData.protein_intake_g) : null,
                water_ml: formData.water_ml ? parseInt(formData.water_ml) : null,
                weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
                sleep_hours: formData.sleep_hours ? parseFloat(formData.sleep_hours) : null,
                mood_rating: formData.mood_rating ? parseInt(formData.mood_rating) : null,
                energy_level: formData.energy_level ? parseInt(formData.energy_level) : null,
                notes: formData.notes || null
            };

            if (editingLog) {
                await updateDailyLog(editingLog.id, logData, isDemo);
                setSuccess('Log updated successfully!');
            } else {
                // Check if log already exists for this date
                const existingLog = await getDailyLogByDate(formData.log_date, isDemo);
                if (existingLog) {
                    setError('A log already exists for this date. Please edit the existing log or choose a different date.');
                    setTimeout(() => setError(''), 5000);
                    setSaving(false);
                    return;
                }
                await createDailyLog(logData, isDemo);
                setSuccess('Log created successfully!');
            }

            resetForm();
            loadLogs();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            if (err.message.includes('duplicate') || err.code === '23505') {
                setError('A log already exists for this date. Please edit the existing log or choose a different date.');
            } else {
                setError(err.message || 'Failed to save log');
            }
            setTimeout(() => setError(''), 5000);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (log: DailyLog) => {
        setEditingLog(log);
        setFormData({
            log_date: log.log_date,
            workout_completed: log.workout_completed,
            workout_time_minutes: log.workout_time_minutes?.toString() || '',
            steps: log.steps?.toString() || '',
            calories_consumed: log.calories_consumed?.toString() || '',
            protein_intake_g: log.protein_intake_g?.toString() || '',
            water_ml: log.water_ml?.toString() || '',
            weight_kg: log.weight_kg?.toString() || '',
            sleep_hours: log.sleep_hours?.toString() || '',
            mood_rating: log.mood_rating?.toString() || '3',
            energy_level: log.energy_level?.toString() || '3',
            notes: log.notes || ''
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (logId: number) => {
        if (isDemo) {
            setError('Cannot delete logs in demo mode');
            setTimeout(() => setError(''), 3000);
            return;
        }

        if (!confirm('Are you sure you want to delete this log?')) return;

        try {
            await deleteDailyLog(logId, isDemo);
            setSuccess('Log deleted successfully!');
            loadLogs();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to delete log');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleQuickLogToday = async () => {
        const today = new Date().toISOString().split('T')[0];
        const existingLog = logs.find(log => log.log_date === today);

        if (existingLog) {
            handleEdit(existingLog);
        } else {
            setFormData({
                log_date: today,
                workout_completed: false,
                workout_time_minutes: '',
                steps: '',
                calories_consumed: '',
                protein_intake_g: '',
                water_ml: '',
                weight_kg: '',
                sleep_hours: '',
                mood_rating: '3',
                energy_level: '3',
                notes: ''
            });
            setEditingLog(null);
            setShowForm(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const resetForm = () => {
        setFormData({
            log_date: new Date().toISOString().split('T')[0],
            workout_completed: false,
            workout_time_minutes: '',
            steps: '',
            calories_consumed: '',
            protein_intake_g: '',
            water_ml: '',
            weight_kg: '',
            sleep_hours: '',
            mood_rating: '3',
            energy_level: '3',
            notes: ''
        });
        setEditingLog(null);
        setShowForm(false);
    };

    // Calculate quick stats
    const recentLogs = logs.slice(0, 7);
    const workoutsCompleted = recentLogs.filter(log => log.workout_completed).length;
    const avgCalories = recentLogs.length > 0
        ? Math.round(recentLogs.reduce((sum, log) => sum + (log.calories_consumed || 0), 0) / recentLogs.length)
        : 0;
    const avgWater = recentLogs.length > 0
        ? Math.round(recentLogs.reduce((sum, log) => sum + (log.water_ml || 0), 0) / recentLogs.length)
        : 0;

    if (loading) {
        return (
            <AuthWrapper>
                <div className="min-h-screen bg-base-200 flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </AuthWrapper>
        );
    }

    return (
        <AuthWrapper>
            <div className="min-h-screen bg-base-200">
                <div className="drawer lg:drawer-open">
                    <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />

                    <div className="drawer-content flex flex-col">
                        <TopNav isDemo={isDemo} />

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
                                        <h1 className="text-3xl font-bold mb-2">Daily Log</h1>
                                        <p className="text-base-content opacity-70">
                                            Track your daily health metrics
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleQuickLogToday}
                                        className="btn btn-primary gap-2"
                                    >
                                        <Calendar className="h-5 w-5" />
                                        Log Today
                                    </button>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                    <div className="card bg-gradient-to-br from-primary to-primary-focus text-primary-content shadow-lg">
                                        <div className="card-body">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm opacity-80">Workouts (7d)</p>
                                                    <p className="text-3xl font-bold">{workoutsCompleted}/7</p>
                                                </div>
                                                <Activity className="h-10 w-10 opacity-70" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
                                        <div className="card-body">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm opacity-80">Avg Calories (7d)</p>
                                                    <p className="text-3xl font-bold">{avgCalories}</p>
                                                </div>
                                                <Flame className="h-10 w-10 opacity-70" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card bg-gradient-to-br from-info to-info-focus text-info-content shadow-lg">
                                        <div className="card-body">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm opacity-80">Avg Water (7d)</p>
                                                    <p className="text-3xl font-bold">{avgWater}ml</p>
                                                </div>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Section */}
                                {showForm && (
                                    <div className="card bg-base-100 shadow-xl mb-8">
                                        <div className="card-body">
                                            <h2 className="card-title text-2xl mb-4">
                                                {editingLog ? 'Edit Log' : 'New Log'}
                                            </h2>
                                            <DailyLogForm
                                                formData={formData}
                                                setFormData={setFormData}
                                                onSubmit={handleSubmit}
                                                onCancel={resetForm}
                                                isEditing={!!editingLog}
                                                saving={saving}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Add Log Button (when form is hidden) */}
                                {!showForm && (
                                    <button
                                        onClick={() => {
                                            setShowForm(true);
                                            setEditingLog(null);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="btn btn-outline btn-primary btn-block mb-8 gap-2"
                                    >
                                        <Plus className="h-5 w-5" />
                                        Add New Log
                                    </button>
                                )}

                                {/* Logs List */}
                                <div className="mb-4">
                                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                        <TrendingUp className="h-6 w-6 text-primary" />
                                        Recent Logs
                                    </h2>
                                </div>

                                {logs.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {logs.map(log => (
                                            <DailyLogCard
                                                key={log.id}
                                                log={log}
                                                onEdit={handleEdit}
                                                onDelete={handleDelete}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="card bg-base-100 shadow-lg">
                                        <div className="card-body items-center text-center py-16">
                                            <Calendar className="h-16 w-16 text-base-content opacity-20 mb-4" />
                                            <h3 className="text-xl font-bold mb-2">No logs yet</h3>
                                            <p className="text-base-content opacity-70 mb-6">
                                                Start tracking your daily health metrics
                                            </p>
                                            <button
                                                onClick={handleQuickLogToday}
                                                className="btn btn-primary gap-2"
                                            >
                                                <Plus className="h-5 w-5" />
                                                Create Your First Log
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="drawer-side">
                        <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
                        <Sidebar />
                    </div>
                </div>
            </div>
        </AuthWrapper>
    );
}