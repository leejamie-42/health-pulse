import { Check } from 'lucide-react';

export interface CompletedGoal {
    id: number;
    name: string;
    type: string;
    completedDate: string;
}

interface CompletedGoalCardProps {
    goal: CompletedGoal;
}

export function CompletedGoalCard({ goal }: CompletedGoalCardProps) {
    return (
        <div className="bg-base-100/80 border border-white/10 rounded-xl backdrop-blur-sm shadow-lg">
            <div className="card-body py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-success bg-opacity-10 p-2">
                            <Check className="h-5 w-5 text-success" />
                        </div>
                        <div>
                            <h3 className="font-semibold">{goal.name}</h3>
                            <p className="text-sm text-base-content opacity-70">{goal.type}</p>
                        </div>
                    </div>
                    <div className="text-sm text-base-content opacity-70">
                        Completed: {new Date(goal.completedDate).toLocaleDateString()}
                    </div>
                </div>
            </div>
        </div>
    );
}