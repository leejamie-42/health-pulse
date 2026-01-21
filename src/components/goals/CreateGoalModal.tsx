import { useState } from 'react';

interface CreateGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateGoalModal({ isOpen, onClose }: CreateGoalModalProps) {
    const [goalType, setGoalType] = useState('');
    const [goalName, setGoalName] = useState('');
    const [targetValue, setTargetValue] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add goal creation logic here
        onClose();
        // Reset form
        setGoalType('');
        setGoalName('');
        setTargetValue('');
        setStartDate('');
        setEndDate('');
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-2xl rounded-2xl">
                <h3 className="font-bold text-2xl mb-6">Create New Goal</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Goal Type</span>
                        </label>
                        <select
                            className="select select-bordered rounded-lg"
                            value={goalType}
                            onChange={(e) => setGoalType(e.target.value)}
                            required
                        >
                            <option value="">Select a type</option>
                            <option value="weight">Weight Loss/Gain</option>
                            <option value="activity">Activity/Steps</option>
                            <option value="nutrition">Nutrition</option>
                            <option value="fitness">Fitness</option>
                            <option value="habit">Habit Building</option>
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Goal Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Lose 10 pounds"
                            className="input input-bordered rounded-lg"
                            value={goalName}
                            onChange={(e) => setGoalName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Target Value</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., 10 lbs, 10000 steps"
                            className="input input-bordered rounded-lg"
                            value={targetValue}
                            onChange={(e) => setTargetValue(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Start Date</span>
                            </label>
                            <input
                                type="date"
                                className="input input-bordered rounded-lg"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Target Date</span>
                            </label>
                            <input
                                type="date"
                                className="input input-bordered rounded-lg"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="modal-action">
                        <button
                            type="button"
                            className="btn btn-ghost rounded-lg"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary rounded-lg">
                            Create Goal
                        </button>
                    </div>
                </form>
            </div>
            <label className="modal-backdrop" onClick={onClose}>Close</label>
        </div>
    );
}