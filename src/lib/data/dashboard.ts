// lib/data/dashboard.ts
import { createSupabaseClient } from '@lib/supabase/client';

interface Goal {
    id: number;
    name: string;
    target_value: number;
    current_value: number;
    unit: string;
    status: string;
}

interface DailyLog {
    log_date: string;
    workout_completed: boolean;
    calories: number;
    water_ml: number;
}

interface DashboardStats {
    activeGoals: number;
    weeklyWorkouts: number;
    avgCalories: number;
    waterTrend: number;
}

export async function getDashboardData(isDemo: boolean) {
    const supabase = createSupabaseClient();

    if (isDemo) {
        // Fetch demo goals
        const { data: goals, error: goalsError } = await supabase
            .from('demo_goals')
            .select('*')
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (goalsError) {
            console.error('Error fetching demo goals:', goalsError);
            return { goals: [], stats: getDefaultStats() };
        }

        // Fetch demo daily logs from the past 7 days
        const { data: logs, error: logsError } = await supabase
            .from('demo_daily_logs')
            .select('*')
            .gte('log_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
            .order('log_date', { ascending: false });

        if (logsError) {
            console.error('Error fetching demo logs:', logsError);
            return { goals: goals || [], stats: getDefaultStats() };
        }

        // Calculate stats from the data
        const stats = calculateStats(goals as Goal[], logs as DailyLog[]);

        // Transform goals to match the expected format
        const transformedGoals = (goals || []).map(goal => ({
            id: goal.id,
            name: goal.name,
            progress: Math.round((goal.current_value / goal.target_value) * 100),
            target: `${goal.target_value}${goal.unit === 'steps' ? '' : ' ' + goal.unit}`,
            current: `${goal.current_value}${goal.unit === 'steps' ? '' : ' ' + goal.unit}`,
        }));

        return {
            goals: transformedGoals,
            stats,
        };
    }

    // TODO: Real user data will go here later
    return {
        goals: [],
        stats: getDefaultStats(),
    };
}

function calculateStats(goals: Goal[], logs: DailyLog[]): DashboardStats {
    // Active goals count
    const activeGoals = goals.filter(g => g.status === 'active').length;

    // Weekly workouts percentage (out of 7 days)
    const workoutsCompleted = logs.filter(log => log.workout_completed).length;
    const weeklyWorkouts = Math.round((workoutsCompleted / 7) * 100);

    // Average calories over the period
    const totalCalories = logs.reduce((sum, log) => sum + (log.calories || 0), 0);
    const avgCalories = logs.length > 0 ? Math.round(totalCalories / logs.length) : 0;

    // Water trend: compare last 3 days to previous 4 days
    const sortedLogs = [...logs].sort((a, b) =>
        new Date(b.log_date).getTime() - new Date(a.log_date).getTime()
    );

    const last3Days = sortedLogs.slice(0, 3);
    const previous4Days = sortedLogs.slice(3, 7);

    const last3DaysAvg = last3Days.length > 0
        ? last3Days.reduce((sum, log) => sum + (log.water_ml || 0), 0) / last3Days.length
        : 0;

    const previous4DaysAvg = previous4Days.length > 0
        ? previous4Days.reduce((sum, log) => sum + (log.water_ml || 0), 0) / previous4Days.length
        : 0;

    const waterTrend = previous4DaysAvg > 0
        ? Math.round(((last3DaysAvg - previous4DaysAvg) / previous4DaysAvg) * 100)
        : 0;

    return {
        activeGoals,
        weeklyWorkouts,
        avgCalories,
        waterTrend,
    };
}

function getDefaultStats(): DashboardStats {
    return {
        activeGoals: 0,
        weeklyWorkouts: 0,
        avgCalories: 0,
        waterTrend: 0,
    };
}