// components/CreateGoalModal.tsx
import { Calendar } from 'lucide-react';
import { Goal } from '@lib/data/goals';

interface CreateGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    formData: {
        name: string;
        target_value: string;
        current_value: string;
        unit: string;
        start_date: string;
        deadline_date: string;
        status: 'active' | 'completed' | 'paused' | 'not_started' | 'failed';
    };
    setFormData: (data: any) => void;
    editingGoal: Goal | null;
}

export function CreateGoalModal({
    isOpen,
    onClose,
    onSubmit,
    formData,
    setFormData,
    editingGoal
}: CreateGoalModalProps) {
    const isCustomUnit = formData.unit && ![
        'kg', 'steps', 'g', 'ml', 'minutes', 'km',
        'calories', 'reps', 'sets', 'hours', 'days'
    ].includes(formData.unit);

    // NEW: Check if "custom" option is selected
    const isSelectingCustom = formData.unit === '__custom__';

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
                <h3 className="font-bold text-2xl mb-6">
                    {editingGoal ? 'Edit Goal' : 'Create New Goal'}
                </h3>
                <form onSubmit={onSubmit} className="space-y-4">
                    {/* Goal Name */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Goal Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Lose 10 kg, Run 5km daily, Drink 2L water"
                            className="input input-bordered rounded-lg"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    {/* Target and Current Value */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Target Value</span>
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="10"
                                className="input input-bordered rounded-lg"
                                value={formData.target_value}
                                onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Current Value</span>
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="0"
                                className="input input-bordered rounded-lg"
                                value={formData.current_value}
                                onChange={(e) => setFormData({ ...formData, current_value: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Unit */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Unit</span>
                        </label>
                        {/* <select
                            className="select select-bordered rounded-lg"
                            value={formData.unit}
                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                            required
                        >
                            <option value="">Select unit</option>
                            <option value="kg">kg (weight)</option>
                            <option value="steps">steps (daily)</option>
                            <option value="g">g (protein/nutrition)</option>
                            <option value="ml">ml (water)</option>
                            <option value="minutes">minutes (exercise)</option>
                            <option value="km">km (distance)</option>
                            <option value="calories">calories</option>
                            <option value="reps">reps (exercise)</option>
                            <option value="sets">sets (exercise)</option>
                            <option value="hours">hours</option>
                            <option value="days">days</option>
                        </select> */}
                        {(!isCustomUnit || isSelectingCustom) && (
                            <select
                                className="select select-bordered rounded-lg"
                                value={isSelectingCustom ? '__custom__' : formData.unit}
                                onChange={(e) => {
                                    if (e.target.value === '__custom__') {
                                        // Switch to custom input mode
                                        setFormData({ ...formData, unit: '__custom__' });
                                    } else {
                                        setFormData({ ...formData, unit: e.target.value });
                                    }
                                }}
                                required={!isCustomUnit}
                            >
                                <option value="">Select unit</option>
                                <option value="__custom__">✏️ Enter custom unit...</option>
                                <option value="kg">kg (weight)</option>
                                <option value="steps">steps (daily)</option>
                                <option value="g">g (protein/nutrition)</option>
                                <option value="ml">ml (water)</option>
                                <option value="minutes">minutes (exercise)</option>
                                <option value="km">km (distance)</option>
                                <option value="calories">calories</option>
                                <option value="reps">reps (exercise)</option>
                                <option value="sets">sets (exercise)</option>
                                <option value="hours">hours</option>
                                <option value="days">days</option>
                            </select>
                        )}

                        {/* Show text input when custom is selected or already has custom value */}
                        {(isSelectingCustom || isCustomUnit) && (
                            <div className="mt-2 flex gap-2">
                                <input
                                    type="text"
                                    placeholder="e.g., lbs, servings, sessions"
                                    className="input input-bordered rounded-lg flex-1"
                                    value={isSelectingCustom ? '' : formData.unit}
                                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                    required
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, unit: '' })}
                                    className="btn btn-ghost btn-sm"
                                    title="Back to dropdown"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        <label className="label">
                            <span className="label-text-alt text-base-content opacity-60">
                                {isSelectingCustom || isCustomUnit
                                    ? 'Enter your custom unit (e.g., "lbs", "servings", "sessions")'
                                    : 'Choose from common units or enter a custom one'
                                }
                            </span>
                        </label>
                    </div>

                    {/* Start Date */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Start Date (Optional)
                            </span>
                        </label>
                        <input
                            type="date"
                            className="input input-bordered rounded-lg"
                            value={formData.start_date}
                            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        />
                        <label className="label">
                            <span className="label-text-alt text-base-content opacity-60">
                                When did you start working on this goal?
                            </span>
                        </label>
                    </div>

                    {/* Deadline Date */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Deadline (Optional)
                            </span>
                        </label>
                        <input
                            type="date"
                            className="input input-bordered rounded-lg"
                            value={formData.deadline_date}
                            onChange={(e) => setFormData({ ...formData, deadline_date: e.target.value })}
                        />
                        <label className="label">
                            <span className="label-text-alt text-base-content opacity-60">
                                Leave empty if no specific deadline
                            </span>
                        </label>
                    </div>

                    {/* Status */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Status</span>
                        </label>
                        <select
                            className="select select-bordered rounded-lg"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        >
                            <option value="not_started">Not Started</option>
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                        </select>
                        <label className="label">
                            <span className="label-text-alt text-base-content opacity-60">
                                {formData.status === 'not_started' && 'Goal is planned but not yet started'}
                                {formData.status === 'active' && 'Currently working on this goal'}
                                {formData.status === 'paused' && 'Temporarily paused'}
                                {formData.status === 'completed' && 'Successfully completed'}
                                {formData.status === 'failed' && 'Goal was not achieved'}
                            </span>
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="modal-action">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-ghost"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {editingGoal ? 'Update Goal' : 'Create Goal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}