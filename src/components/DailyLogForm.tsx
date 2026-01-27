// components/DailyLogForm.tsx
import { Activity, Droplets, Flame, Moon, Zap, Weight, Footprints, Clock, FileText } from 'lucide-react';
import { Angry, Frown, Meh, Smile, Laugh } from 'lucide-react';
import { Battery, BatteryLow, BatteryMedium, BatteryFull, BatteryPlus } from 'lucide-react';

interface DailyLogFormProps {
    formData: {
        log_date: string;
        workout_completed: boolean | null;
        workout_time_minutes: string;
        steps: string;
        calories_consumed: string;
        protein_intake_g: string;
        water_ml: string;
        weight_kg: string;
        sleep_hours: string;
        mood_rating: string;
        energy_level: string;
        notes: string;
    };
    setFormData: (data: any) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    isEditing: boolean;
    saving: boolean;
}

export function DailyLogForm({
    formData,
    setFormData,
    onSubmit,
    onCancel,
    isEditing,
    saving
}: DailyLogFormProps) {
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
        <form onSubmit={onSubmit} className="space-y-6">
            {/* Date Selection */}
            <div className="form-control">
                <label className="label">
                    <span className="label-text font-semibold text-lg">Date</span>
                </label>
                <input
                    type="date"
                    className="input input-bordered input-lg rounded-lg"
                    value={formData.log_date}
                    onChange={(e) => setFormData({ ...formData, log_date: e.target.value })}
                    max={new Date().toISOString().split('T')[0]}
                    required
                />
            </div>

            {/* Activity Section */}
            <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                    <h3 className="card-title text-lg flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Activity
                    </h3>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        {/* <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-3">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary"
                                    checked={formData.workout_completed}
                                    onChange={(e) => setFormData({ ...formData, workout_completed: e.target.checked })}
                                />
                                <span className="label-text font-semibold">Workout Completed</span>
                            </label>
                        </div> */}

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text flex items-center gap-2">Workout Completed?</span>
                            </label>
                            <select
                                className="select select-bordered rounded-lg"
                                aria-label="Workout completed"
                                value={
                                    formData.workout_completed === true
                                        ? 'yes'
                                        : formData.workout_completed === false
                                            ? 'no'
                                            : ''
                                }
                                onChange={(e) => setFormData({ ...formData, workout_completed: e.target.value === '' ? null : e.target.value === 'yes', })}
                            >
                                <option value="" disabled hidden>Select option</option>
                                <option value="yes">yes</option>
                                <option value="no">no</option>
                            </select>
                        </div>


                        <div className="form-control">
                            <label className="label">
                                <span className="label-text flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Workout Time (minutes)
                                </span>
                            </label>
                            <input
                                type="number"
                                placeholder="45"
                                className="input input-bordered rounded-lg"
                                value={formData.workout_time_minutes}
                                onChange={(e) => setFormData({ ...formData, workout_time_minutes: e.target.value })}
                                min="0"
                                max="1440"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text flex items-center gap-2">
                                    <Footprints className="h-4 w-4" />
                                    Steps
                                </span>
                            </label>
                            <input
                                type="number"
                                placeholder="10000"
                                className="input input-bordered rounded-lg"
                                value={formData.steps}
                                onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                                min="0"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Nutrition Section */}
            <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                    <h3 className="card-title text-lg flex items-center gap-2">
                        <Flame className="h-5 w-5 text-orange-500" />
                        Nutrition
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text flex items-center gap-2">
                                    <Flame className="h-4 w-4" />
                                    Calories
                                </span>
                            </label>
                            <input
                                type="number"
                                placeholder="2000"
                                className="input input-bordered rounded-lg"
                                value={formData.calories_consumed}
                                onChange={(e) => setFormData({ ...formData, calories_consumed: e.target.value })}
                                min="0"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Protein (g)</span>
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="150"
                                className="input input-bordered rounded-lg"
                                value={formData.protein_intake_g}
                                onChange={(e) => setFormData({ ...formData, protein_intake_g: e.target.value })}
                                min="0"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text flex items-center gap-2">
                                    <Droplets className="h-4 w-4" />
                                    Water (ml)
                                </span>
                            </label>
                            <input
                                type="number"
                                placeholder="2000"
                                className="input input-bordered rounded-lg"
                                value={formData.water_ml}
                                onChange={(e) => setFormData({ ...formData, water_ml: e.target.value })}
                                min="0"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Body & Wellness Section */}
            <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                    <h3 className="card-title text-lg flex items-center gap-2">
                        <Smile className="h-5 w-5 text-secondary" />
                        Body & Wellness
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text flex items-center gap-2">
                                    <Weight className="h-4 w-4" />
                                    Weight (kg)
                                </span>
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="75.5"
                                className="input input-bordered rounded-lg"
                                value={formData.weight_kg}
                                onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                                min="0"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text flex items-center gap-2">
                                    <Moon className="h-4 w-4" />
                                    Sleep (hours)
                                </span>
                            </label>
                            <input
                                type="number"
                                step="0.5"
                                placeholder="7.5"
                                className="input input-bordered rounded-lg"
                                value={formData.sleep_hours}
                                onChange={(e) => setFormData({ ...formData, sleep_hours: e.target.value })}
                                min="0"
                                max="24"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text flex items-center gap-2">
                                    <Smile className="h-4 w-4" />
                                    Mood Rating (1-5)
                                </span>
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    className="range range-primary"
                                    value={formData.mood_rating || 3}
                                    onChange={(e) => setFormData({ ...formData, mood_rating: e.target.value })}
                                />
                                <span>{parseInt(formData.mood_rating || '3')}</span>
                                <span>{getMoodEmoji(parseInt(formData.mood_rating || '3'))}</span>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text flex items-center gap-2">
                                    <Zap className="h-4 w-4" />
                                    Energy Level (1-5)
                                </span>
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    className="range range-secondary"
                                    value={formData.energy_level || 3}
                                    onChange={(e) => setFormData({ ...formData, energy_level: e.target.value })}
                                />
                                <span>{parseInt(formData.energy_level || '3')}</span>
                                <span>{getEnergyIcon(parseInt(formData.energy_level || '3'))}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notes Section */}
            <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                    <h3 className="card-title text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-accent" />
                        Notes
                    </h3>
                    <textarea
                        className="textarea textarea-bordered rounded-lg h-24"
                        placeholder="How did you feel today? Any achievements or challenges?"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-ghost rounded-lg"
                    disabled={saving}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className={`btn btn-primary rounded-lg ${saving ? 'loading' : ''}`}
                    disabled={saving}
                >
                    {saving ? 'Saving...' : isEditing ? 'Update Log' : 'Save Log'}
                </button>
            </div>
        </form>
    );
}