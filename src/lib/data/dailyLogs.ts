// lib/data/dailyLogs.ts
import { createSupabaseClient } from '@lib/supabase/client';
import { DEMO_USER_ID } from '@lib/constants';

export interface DailyLog {
    id: number;
    user_id: string;
    log_date: string;
    workout_completed: boolean;
    workout_time_minutes: number | null;
    steps: number | null;
    calories_consumed: number | null;
    protein_intake_g: number | null;
    water_ml: number | null;
    weight_kg: number | null;
    sleep_hours: number | null;
    mood_rating: number | null;
    energy_level: number | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateDailyLogInput {
    log_date: string;
    workout_completed?: boolean;
    workout_time_minutes?: number | null;
    steps?: number | null;
    calories_consumed?: number | null;
    protein_intake_g?: number | null;
    water_ml?: number | null;
    weight_kg?: number | null;
    sleep_hours?: number | null;
    mood_rating?: number | null;
    energy_level?: number | null;
    notes?: string | null;
}

export interface UpdateDailyLogInput {
    workout_completed?: boolean;
    workout_time_minutes?: number | null;
    steps?: number | null;
    calories_consumed?: number | null;
    protein_intake_g?: number | null;
    water_ml?: number | null;
    weight_kg?: number | null;
    sleep_hours?: number | null;
    mood_rating?: number | null;
    energy_level?: number | null;
    notes?: string | null;
}


export async function getDailyLogs(isDemo: boolean = false, limit: number = 30): Promise<DailyLog[]> {
    const supabase = createSupabaseClient();
    let userId: string;

    if (isDemo) {
        userId = DEMO_USER_ID;
    } else {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            throw new Error('User not authenticated');
        }
        userId = user.id;
    }
    const { data, error } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', userId)
        .order('log_date', { ascending: false })
        .limit(limit);
    if (error) {
        console.error('Error fetching daily logs:', error);
        throw error;
    }
    return data as DailyLog[];
}

export async function getDailyLogByDate(date: string, isDemo: boolean = false): Promise<DailyLog | null> {
    const supabase = createSupabaseClient();
    let userId: string;

    if (isDemo) {
        userId = DEMO_USER_ID;
    } else {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            throw new Error('User not authenticated');
        }
        userId = user.id;
    }
    const { data, error } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('log_date', date)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            // No rows returned
            return null;
        }
        console.error('Error fetching daily log:', error);
        throw error;
    }

    return data as DailyLog;
}

export async function createDailyLog(logData: CreateDailyLogInput, isDemo: boolean = false): Promise<DailyLog> {
    if (isDemo) {
        throw new Error('Cannot create logs in demo mode');
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
        .from('daily_logs')
        .insert([{
            user_id: user.id,
            log_date: logData.log_date,
            workout_completed: logData.workout_completed || false,
            workout_time_minutes: logData.workout_time_minutes || null,
            steps: logData.steps || null,
            calories_consumed: logData.calories_consumed || null,
            protein_intake_g: logData.protein_intake_g || null,
            water_ml: logData.water_ml || null,
            weight_kg: logData.weight_kg || null,
            sleep_hours: logData.sleep_hours || null,
            mood_rating: logData.mood_rating || null,
            energy_level: logData.energy_level || null,
            notes: logData.notes || null,
        }])
        .select()
        .single();

    if (error) {
        console.error('Error creating daily log:', error);
        throw error;
    }

    return data as DailyLog;
}

export async function updateDailyLog(
    logId: number,
    updates: UpdateDailyLogInput,
    isDemo: boolean = false
): Promise<DailyLog> {
    if (isDemo) {
        throw new Error('Cannot update logs in demo mode');
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
        .from('daily_logs')
        .update(updates)
        .eq('id', logId)
        .eq('user_id', user.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating daily log:', error);
        throw error;
    }
    return data as DailyLog;
}

export async function deleteDailyLog(logId: number, isDemo: boolean = false): Promise<void> {
    if (isDemo) {
        throw new Error('Cannot delete logs in demo mode');
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        throw new Error('User not authenticated');
    }

    const { error } = await supabase
        .from('daily_logs')
        .delete()
        .eq('id', logId)
        .eq('user_id', user.id);

    if (error) {
        console.error('Error deleting daily log:', error);
        throw error;
    }
}

export async function getRecentLogs(days: number = 7, isDemo: boolean = false): Promise<DailyLog[]> {
    const supabase = createSupabaseClient();
    let userId: string;

    if (isDemo) {
        userId = DEMO_USER_ID;
    } else {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            throw new Error('User not authenticated');
        }
        userId = user.id;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const dateString = startDate.toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('log_date', dateString)
        .order('log_date', { ascending: false });

    if (error) {
        console.error('Error fetching recent logs:', error);
        throw error;
    }

    return data as DailyLog[];
}
