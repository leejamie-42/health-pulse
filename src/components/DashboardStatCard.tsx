
// components/DashboardStatCard.tsx
import * as React from "react";
import type { LucideIcon } from "lucide-react";

type DashboardStatCardProps = {
    label: string;
    value: string | number;
    icon: LucideIcon;            // e.g. Target, Activity...
    color?: string;              // Tailwind bg class, e.g. "bg-primary"
    iconColor?: string;          // Tailwind text class, e.g. "text-white"
};

export function DashboardStatCard({
    label,
    value,
    icon: Icon,
    color = "bg-base-100",
    iconColor = "text-primary",
}: DashboardStatCardProps) {
    return (
        <div className="card bg-base-100/80 border border-white/10 rounded-xl backdrop-blur-sm shadow-lg">
            <div className="card-body">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-base-content opacity-70 text-sm">{label}</p>
                        <p className="text-3xl font-bold mt-2">{value}</p>
                    </div>

                    {/* Chip behind the icon */}
                    <div className={`rounded-lg ${color} bg-opacity-10 p-3`}>
                        <Icon className={`h-6 w-6 ${iconColor}`} />
                    </div>
                </div>
            </div>
        </div>
    );
}
