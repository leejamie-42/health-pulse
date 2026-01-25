// components/GoalCard.tsx
import { Edit2, Trash2, Check, X, Target, PlayCircle, XCircle } from 'lucide-react';
import { Goal } from '@lib/data/goals';

interface GoalCardProps {
    goal: Goal;
    onEdit: (goal: Goal) => void;
    onDelete: (id: number) => void;
    onStatusChange: (goal: Goal, status: 'active' | 'completed' | 'paused' | 'not_started' | 'failed') => void;
}

export function GoalCard({ goal, onEdit, onDelete, onStatusChange }: GoalCardProps) {
    const progress = Math.min(Math.round((goal.current_value / goal.target_value) * 100), 100);
    const daysLeft = goal.deadline_date ? Math.ceil((new Date(goal.deadline_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

    // const getProgressColor = (progress: number) => {
    //     if (progress >= 100) return 'progress-success';
    //     if (progress >= 70) return 'progress-info';
    //     if (progress >= 40) return 'progress-warning';
    //     return 'progress-error';
    // };

    const getStatusBadge = (status: string) => {
        const badges = {
            active: 'badge-info',
            completed: 'badge-success',
            paused: 'badge-warning',
            not_started: 'badge-ghost',
            failed: 'badge-error'
        };
        return badges[status as keyof typeof badges] || 'badge-ghost';
    };

    const getStatusLabel = (status: string) => {
        const labels = {
            active: 'Active',
            completed: 'Completed',
            paused: 'Paused',
            not_started: 'Not Started',
            failed: 'Failed'
        };
        return labels[status as keyof typeof labels] || status;
    };

    return (
        <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="card-title text-lg mb-2">{goal.name}</h3>
                        <div className="flex gap-2 flex-wrap">
                            <span className={`badge ${getStatusBadge(goal.status)}`}>
                                {getStatusLabel(goal.status)}
                            </span>
                            {daysLeft !== null && (
                                <span className={`badge badge-outline ${daysLeft < 0 ? 'badge-error' : daysLeft <= 7 ? 'badge-warning' : ''}`}>
                                    {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-5 h-5 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v.01M12 12v.01M12 18v.01"></path>
                            </svg>
                        </label>
                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 z-10">
                            <li><a onClick={() => onEdit(goal)}><Edit2 className="h-4 w-4" /> Edit</a></li>

                            {/* Status change options */}
                            {goal.status === 'not_started' && (
                                <li><a onClick={() => onStatusChange(goal, 'active')}><PlayCircle className="h-4 w-4" /> Start Goal</a></li>
                            )}
                            {goal.status !== 'completed' && goal.status !== 'failed' && (
                                <li><a onClick={() => onStatusChange(goal, 'completed')}><Check className="h-4 w-4" /> Mark Complete</a></li>
                            )}
                            {goal.status === 'active' && (
                                <li><a onClick={() => onStatusChange(goal, 'paused')}><X className="h-4 w-4" /> Pause</a></li>
                            )}
                            {(goal.status === 'paused' || goal.status === 'not_started') && (
                                <li><a onClick={() => onStatusChange(goal, 'active')}><Target className="h-4 w-4" /> Resume/Activate</a></li>
                            )}
                            {goal.status !== 'failed' && goal.status !== 'completed' && (
                                <li><a onClick={() => onStatusChange(goal, 'failed')} className="text-error"><XCircle className="h-4 w-4" /> Mark Failed</a></li>
                            )}

                            <div className="divider my-1"></div>
                            <li><a onClick={() => onDelete(goal.id)} className="text-error"><Trash2 className="h-4 w-4" /> Delete</a></li>
                        </ul>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-base-content opacity-70">Progress</span>
                        <span className="font-semibold">{progress}%</span>
                    </div>
                    <progress className={`progress progress-success w-full`} value={progress} max="100"></progress>
                    <div className="flex justify-between text-sm">
                        <span className="font-semibold">{goal.current_value} {goal.unit}</span>
                        <span className="text-base-content opacity-70">of {goal.target_value} {goal.unit}</span>
                    </div>
                </div>

                {goal.deadline_date && (
                    <div className="text-xs text-base-content opacity-60 mt-2">
                        Deadline: {new Date(goal.deadline_date).toLocaleDateString()}
                    </div>
                )}
            </div>
        </div>
    );
}