// components/DailyLogCard.tsx
import { Edit2, Trash2, Activity, Droplets, Flame, Moon, Zap, Weight, Footprints, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Angry, Frown, Meh, Smile, Laugh } from 'lucide-react';
import { Battery, BatteryLow, BatteryMedium, BatteryFull, BatteryPlus } from 'lucide-react';
import { DailyLog } from '@lib/data/dailyLogs';

interface DailyLogCardProps {
    log: DailyLog;
    onEdit: (log: DailyLog) => void;
    onDelete: (id: number) => void;
}

export function DailyLogCard({ log, onEdit, onDelete }: DailyLogCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        }
    };

    // const getMoodEmoji = (rating: number | null) => {
    //     if (!rating) return '😐';
    //     const emojis = ['😢', '😕', '😐', '😊', '😄'];
    //     return emojis[rating - 1] || '😐';
    // };

    // const getEnergyIcon = (level: number | null) => {
    //     if (!level) return '🔋';
    //     const icons = ['🔋', '🔋🔋', '🔋🔋🔋', '⚡⚡', '⚡⚡⚡'];
    //     return icons[level - 1] || '🔋';
    // };

    const getMoodEmoji = (rating: number) => {
        // const emojis = ['😢', '😕', '😐', '😊', '😄'];
        // return emojis[rating - 1] || '😐';
        const emojis = [Angry, Frown, Meh, Smile, Laugh];
        const Icon = emojis[rating - 1] || Meh;
        return <Icon />
    };

    const getEnergyIcon = (level: number) => {
        // const icons = ['🔋', '🔋🔋', '🔋🔋🔋', '⚡⚡', '⚡⚡⚡'];
        // return icons[level - 1] || '🔋';
        const icons = [Battery, BatteryLow, BatteryMedium, BatteryFull, BatteryPlus];
        const Icon = icons[level - 1] || BatteryMedium;
        return <Icon />
    };

    return (
        <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="card-body">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="card-title text-lg">{formatDate(log.log_date)}</h3>
                        <p className="text-sm text-base-content opacity-60">
                            {new Date(log.log_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(log)}
                            className="btn btn-ghost btn-sm btn-circle"
                            aria-label="Edit log"
                        >
                            <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => onDelete(log.id)}
                            className="btn btn-ghost btn-sm btn-circle text-error"
                            aria-label="Delete log"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Workout Badge */}
                <div className="mb-4">
                    {log.workout_completed ? (
                        <div className="badge badge-success gap-2">
                            <CheckCircle className="h-3 w-3" />
                            Workout Completed
                        </div>
                    ) : (
                        <div className="badge badge-ghost gap-2">
                            <XCircle className="h-3 w-3" />
                            No Workout
                        </div>
                    )}
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {/* Activity Metrics */}
                    {log.workout_time_minutes !== null && (
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary opacity-70" />
                            <div>
                                <p className="text-xs text-base-content opacity-60">Workout</p>
                                <p className="font-semibold">{log.workout_time_minutes} min</p>
                            </div>
                        </div>
                    )}

                    {log.steps !== null && (
                        <div className="flex items-center gap-2">
                            <Footprints className="h-4 w-4 text-primary opacity-70" />
                            <div>
                                <p className="text-xs text-base-content opacity-60">Steps</p>
                                <p className="font-semibold">{log.steps.toLocaleString()}</p>
                            </div>
                        </div>
                    )}

                    {/* Nutrition Metrics */}
                    {log.calories_consumed !== null && (
                        <div className="flex items-center gap-2">
                            <Flame className="h-4 w-4 text-orange-500 opacity-70" />
                            <div>
                                <p className="text-xs text-base-content opacity-60">Calories</p>
                                <p className="font-semibold">{log.calories_consumed}</p>
                            </div>
                        </div>
                    )}

                    {log.protein_intake_g !== null && (
                        <div className="flex items-center gap-2">
                            <span className="text-lg opacity-70">🥩</span>
                            <div>
                                <p className="text-xs text-base-content opacity-60">Protein</p>
                                <p className="font-semibold">{log.protein_intake_g}g</p>
                            </div>
                        </div>
                    )}

                    {log.water_ml !== null && (
                        <div className="flex items-center gap-2">
                            <Droplets className="h-4 w-4 text-info opacity-70" />
                            <div>
                                <p className="text-xs text-base-content opacity-60">Water</p>
                                <p className="font-semibold">{log.water_ml}ml</p>
                            </div>
                        </div>
                    )}

                    {/* Body Metrics */}
                    {log.weight_kg !== null && (
                        <div className="flex items-center gap-2">
                            <Weight className="h-4 w-4 text-secondary opacity-70" />
                            <div>
                                <p className="text-xs text-base-content opacity-60">Weight</p>
                                <p className="font-semibold">{log.weight_kg}kg</p>
                            </div>
                        </div>
                    )}

                    {log.sleep_hours !== null && (
                        <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4 text-secondary opacity-70" />
                            <div>
                                <p className="text-xs text-base-content opacity-60">Sleep</p>
                                <p className="font-semibold">{log.sleep_hours}h</p>
                            </div>
                        </div>
                    )}

                    {/* Wellness Metrics */}
                    {log.mood_rating !== null && (
                        <div className="flex items-center gap-2">
                            <Smile className="h-4 w-4 text-accent opacity-70" />
                            <div>
                                <p className="text-xs text-base-content opacity-60">Mood</p>
                                <p className="font-semibold">{getMoodEmoji(log.mood_rating)} {log.mood_rating}/5</p>
                            </div>
                        </div>
                    )}

                    {log.energy_level !== null && (
                        <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-accent opacity-70" />
                            <div>
                                <p className="text-xs text-base-content opacity-60">Energy</p>
                                <p className="font-semibold">{getEnergyIcon(log.energy_level)} {log.energy_level}/5</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Notes */}
                {log.notes && (
                    <div className="mt-4 pt-4 border-t border-base-300">
                        <p className="text-sm text-base-content opacity-80 italic">"{log.notes}"</p>
                    </div>
                )}
            </div>
        </div>
    );
}