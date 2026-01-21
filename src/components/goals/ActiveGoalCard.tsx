import { Calendar } from 'lucide-react';

export interface ActiveGoal {
    id: number;
    name: string;
    type: string;
    progress: number;
    target: string;
    current: string;
    startDate: string;
    endDate: string;
}

interface ActiveGoalCardProps {
    goal: ActiveGoal;
}

export function ActiveGoalCard({ goal }: ActiveGoalCardProps) {
    return (
        <div className="bg-base-100/80 border border-white/10 rounded-xl backdrop-blur-sm shadow-lg">
            <div className="card-body">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="card-title text-xl">{goal.name}</h3>
                        <p className="text-sm text-base-content opacity-70">{goal.type}</p>
                    </div>
                    <div className="badge badge-primary">{goal.progress}%</div>
                </div>

                <div className="w-full bg-base-300 rounded-full h-3 mb-3">
                    <div
                        className="bg-primary h-3 rounded-full transition-all"
                        style={{ width: `${goal.progress}%` }}
                    ></div>
                </div>

                <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-base-content opacity-70">
                        Current: {goal.current}
                    </span>
                    <span className="font-semibold">
                        Target: {goal.target}
                    </span>
                </div>

                <div className="divider my-2"></div>

                <div className="flex items-center gap-4 text-sm text-base-content opacity-70">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(goal.startDate).toLocaleDateString()}
                    </div>
                    <span>→</span>
                    <div>
                        {new Date(goal.endDate).toLocaleDateString()}
                    </div>
                </div>

                <div className="card-actions justify-end mt-4">
                    <button className="btn btn-sm btn-ghost rounded-lg">View Details</button>
                    <button className="btn btn-sm btn-primary rounded-lg">Update Progress</button>
                </div>
            </div>
        </div >
    );
}