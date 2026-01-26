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
    workout_completed: boolean | null;
    workout_time_minutes: number | null;
    calories_consumed: number | null;
    water_ml: number | null;
}

interface DashboardStats {
    activeGoals: number;
    goalsCompletedThisWeek: number;
    weeklyWorkouts: string;
    avgWorkoutMinutes: number;
    caloriesTrend: number;
    caloriesThisWeek: number;
    waterTrend: number;
    waterThisWeek: number;
}

// Helper function to get this week's boundary dates: Monday & Synday
function getWeekBoundaries(date: Date = new Date()): { weekStart: Date; weekEnd: Date } {
    const current = new Date(date);
    const dayOfWeek = current.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const weekStart = new Date(current);
    weekStart.setDate(current.getDate() + diff);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return { weekStart, weekEnd };
}

// Helper function to get last week's boundary dates: Monday & Synday
function getLastWeekBoundaries(): { weekStart: Date; weekEnd: Date } {
    const today = new Date();
    const lastWeekDate = new Date(today);
    lastWeekDate.setDate(today.getDate() - 7);
    return getWeekBoundaries(lastWeekDate);
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
        .order('created_at', { ascending: false });

    if (goalsError) {
        console.error('Error fetching goals:', goalsError);
        return { goals: [], stats: getDefaultStats() };
    }


    // Fetch daily logs from this week and last week
    const lastWeek = getLastWeekBoundaries();
    const startDate = lastWeek.weekStart.toISOString().split('T')[0];

    const { data: logs, error: logsError } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('log_date', startDate)
        .order('log_date', { ascending: false });

    if (logsError) {
        console.error('Error fetching logs:', logsError);
        return { goals: goals || [], stats: getDefaultStats() };
    }


    // Get dashboard stats
    const stats = calculateStats(goals as Goal[], logs as DailyLog[]);

    const activeGoals = (goals || []).filter(g => g.status === 'active');
    const transformedGoals = transformGoals(activeGoals);

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
        status: goal.status,
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

    // Goals completed this week
    const thisWeek = getWeekBoundaries();
    const goalsCompletedThisWeek = goals.filter(g => {
        if (g.status !== 'completed') return false;
        // Note: You'd need updated_at in goals table to properly track this
        // For now, we'll just count all completed goals as a placeholder
        return g.status === 'completed';
    }).length;

    // Separate logs into this week and last week
    const thisWeekBounds = getWeekBoundaries();
    const lastWeekBounds = getLastWeekBoundaries();

    const thisWeekLogs = logs.filter(log => {
        const logDate = new Date(log.log_date);
        return logDate >= thisWeekBounds.weekStart && logDate <= thisWeekBounds.weekEnd;
    });

    const lastWeekLogs = logs.filter(log => {
        const logDate = new Date(log.log_date);
        return logDate >= lastWeekBounds.weekStart && logDate <= lastWeekBounds.weekEnd;
    });

    // Weekly workouts - show as "X/Y" format
    const today = new Date();
    const daysSinceMonday = today.getDay() === 0 ? 6 : today.getDay() - 1; // Monday = 0
    const daysInWeekSoFar = daysSinceMonday + 1; // +1 including today
    const workoutsThisWeek = thisWeekLogs.filter(log => log.workout_completed).length;
    const weeklyWorkouts = `${workoutsThisWeek}/${daysInWeekSoFar}`;

    // Average workout minutes this week
    const workoutsWithTime = thisWeekLogs.filter(log =>
        log.workout_completed && log.workout_time_minutes !== null
    );
    const avgWorkoutMinutes = workoutsWithTime.length > 0
        ? Math.round(
            workoutsWithTime.reduce((sum, log) => sum + (log.workout_time_minutes || 0), 0) /
            workoutsWithTime.length
        )
        : 0;


    // Calories trend - this week avg vs last week avg
    const thisWeekCaloriesLogs = thisWeekLogs.filter(log => log.calories_consumed !== null && log.calories_consumed !== undefined);
    const lastWeekCaloriesLogs = lastWeekLogs.filter(log => log.calories_consumed !== null && log.calories_consumed !== undefined);

    const thisWeekCaloriesAvg = thisWeekCaloriesLogs.length > 0
        ? thisWeekCaloriesLogs.reduce((sum, log) => sum + (log.calories_consumed || 0), 0) / thisWeekCaloriesLogs.length
        : 0;

    const lastWeekCaloriesAvg = lastWeekCaloriesLogs.length > 0
        ? lastWeekCaloriesLogs.reduce((sum, log) => sum + (log.calories_consumed || 0), 0) / lastWeekCaloriesLogs.length
        : 0;

    const caloriesTrend = lastWeekCaloriesAvg > 0
        ? Math.round(((thisWeekCaloriesAvg - lastWeekCaloriesAvg) / lastWeekCaloriesAvg) * 100)
        : 0;
    const caloriesThisWeek = thisWeekCaloriesLogs.length > 0
        ? Math.round(
            thisWeekCaloriesLogs.reduce((sum, log) => sum + (log.calories_consumed || 0), 0) /
            thisWeekCaloriesLogs.length
        )
        : 0;


    // Water trend - this week avg vs last week avg
    const thisWeekWaterLogs = thisWeekLogs.filter(log => log.water_ml !== null && log.water_ml !== undefined);
    const lastWeekWaterLogs = lastWeekLogs.filter(log => log.water_ml !== null && log.water_ml !== undefined);

    const thisWeekWaterAvg = thisWeekWaterLogs.length > 0
        ? thisWeekWaterLogs.reduce((sum, log) => sum + (log.water_ml || 0), 0) / thisWeekWaterLogs.length
        : 0;

    const lastWeekWaterAvg = lastWeekWaterLogs.length > 0
        ? lastWeekWaterLogs.reduce((sum, log) => sum + (log.water_ml || 0), 0) / lastWeekWaterLogs.length
        : 0;

    const waterTrend = lastWeekWaterAvg > 0
        ? Math.round(((thisWeekWaterAvg - lastWeekWaterAvg) / lastWeekWaterAvg) * 100)
        : 0;

    return {
        activeGoals,
        goalsCompletedThisWeek,
        weeklyWorkouts,
        avgWorkoutMinutes,
        caloriesTrend,
        caloriesThisWeek,
        waterTrend,
        waterThisWeek: Math.round(thisWeekWaterAvg),
    };
}

function getDefaultStats(): DashboardStats {
    return {
        activeGoals: 0,
        goalsCompletedThisWeek: 0,
        weeklyWorkouts: '0/0',
        avgWorkoutMinutes: 0,
        caloriesTrend: 0,
        caloriesThisWeek: 0,
        waterTrend: 0,
        waterThisWeek: 0,
    };
}