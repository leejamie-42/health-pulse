// lib/data/dashboard.ts
import { createSupabaseClient } from '@lib/supabase/client';
import { DEMO_USER_ID } from '@lib/constants';

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

    let userId: string | undefined;

    if (isDemo) {
        userId = DEMO_USER_ID;
    } else {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            console.error('Error getting user:', userError);
            return { goals: [], stats: getDefaultStats() };
        }
        userId = user.id;
    }

    // Fetch goals
    const { data: goals, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

    if (goalsError) {
        console.error('Error fetching goals:', goalsError);
        return { goals: [], stats: getDefaultStats() };
    }

    // Fetch daily logs from the past 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const { data: logs, error: logsError } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('log_date', sevenDaysAgo)
        .order('log_date', { ascending: false });

    if (logsError) {
        console.error('Error fetching logs:', logsError);
        return { goals: goals || [], stats: getDefaultStats() };
    }

    // Get dashboard stats
    const stats = calculateStats(goals as Goal[], logs as DailyLog[]);
    const transformedGoals = transformGoals(goals || []);

    return {
        goals: transformedGoals,
        stats,
    };
}

function transformGoals(goals: any[]): any[] {
    return goals.map(goal => ({
        id: goal.id,
        name: goal.name,
        progress: Math.round((goal.current_value / goal.target_value) * 100),
        target: formatValue(goal.target_value, goal.unit),
        current: formatValue(goal.current_value, goal.unit),
    }));
}

function formatValue(value: number, unit: string): string {
    if (unit === 'steps') {
        return value.toLocaleString(); // Format with commas: 10,000
    }
    return `${value} ${unit}`;
}

function calculateStats(goals: Goal[], logs: DailyLog[]): DashboardStats {
    // Active goals count
    const activeGoals = goals.filter(g => g.status === 'active').length;

    // Weekly workouts percentage (out of 7 days)
    const workoutsCompleted = logs.filter(log => log.workout_completed).length;
    const weeklyWorkouts = logs.length > 0 ? Math.round((workoutsCompleted / Math.min(logs.length, 7)) * 100) : 0;

    // Average calories over the period
    const logsWithCalories = logs.filter(log => log.calories !== null && log.calories !== undefined);
    const totalCalories = logsWithCalories.reduce((sum, log) => sum + log.calories, 0);
    const avgCalories = logsWithCalories.length > 0 ? Math.round(totalCalories / logsWithCalories.length) : 0;

    // Water trend: compare last 3 days to previous 4 days
    const sortedLogs = [...logs].sort((a, b) =>
        new Date(b.log_date).getTime() - new Date(a.log_date).getTime()
    );

    const last3Days = sortedLogs.slice(0, 3).filter(log => log.water_ml !== null && log.water_ml !== undefined);
    const previous4Days = sortedLogs.slice(3, 7).filter(log => log.water_ml !== null && log.water_ml !== undefined);

    const last3DaysAvg = last3Days.length > 0
        ? last3Days.reduce((sum, log) => sum + log.water_ml, 0) / last3Days.length
        : 0;

    const previous4DaysAvg = previous4Days.length > 0
        ? previous4Days.reduce((sum, log) => sum + log.water_ml, 0) / previous4Days.length
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