// components/DashboardGoalProgressCard.tsx
import * as React from "react";

export type Goal = {
    id: number | string;
    name: string;
    progress: number;
    target: string;
    current: string;
    status?: string;
};

type DashboardGoalProgressCardProps = {
    goal: Goal;
};

export function DashboardGoalProgressCard({ goal }: DashboardGoalProgressCardProps) {
    return (
        <div className="border border-white/10 rounded-xl backdrop-blur-sm shadow-lg  p-4 hover:border-primary transition-colors">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{goal.name}</h3>
                <span className="text-sm text-base-content opacity-70">
                    {goal.current} / {goal.target}
                </span>
            </div>

            <div className="w-full bg-base-300 rounded-full h-2">
                <div
                    className="bg-primary h-2 rounded-full transition-all ${getProgressColor()}"
                    style={{ width: `min(100%, ${goal.progress}%)` }}
                />
            </div>

            {/* <p className="text-sm text-base-content opacity-70 mt-2">
                {goal.progress}% complete
            </p> */}
            <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-base-content opacity-70">
                    {goal.progress >= 100 ? (
                        <span className="text-success font-semibold">✓ Complete!</span>
                    ) : (
                        <span>{goal.progress}% complete</span>
                    )}
                </p>
            </div>
        </div>
    );
}

