// lib/data/goals.ts
import { createSupabaseClient } from '@lib/supabase/client';
import { DEMO_USER_ID } from '@lib/constants';

export interface Goal {
    id: number;
    user_id: string;
    name: string;
    target_value: number;
    current_value: number;
    unit: string;
    start_date: string | null;
    deadline_date: string | null;
    status: 'not_started' | 'active' | 'completed' | 'failed' | 'paused';
    created_at: string;
    updated_at: string;
}

export interface CreateGoalInput {
    name: string;
    target_value: number;
    current_value: number;
    unit: string;
    start_date?: string | null;
    deadline_date?: string | null;
    status?: 'not_started' | 'active' | 'completed' | 'failed' | 'paused';
}

export interface UpdateGoalInput {
    name?: string;
    target_value?: number;
    current_value?: number;
    unit?: string;
    start_date?: string | null;
    deadline_date?: string | null;
    status?: 'not started' | 'active' | 'completed' | 'failed' | 'paused';
}

export async function getGoals(isDemo: boolean = false): Promise<Goal[]> {
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
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching goals:', error);
        throw error;
    }

    return data as Goal[];
}

export async function getGoalById(goalId: number, isDemo: boolean = false): Promise<Goal | null> {
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
        .from('goals')
        .select('*')
        .eq('id', goalId)
        .eq('user_id', userId)
        .single();

    if (error) {
        console.error('Error fetching goal:', error);
        return null;
    }

    return data as Goal;
}

export async function createGoal(goalData: CreateGoalInput, isDemo: boolean = false): Promise<Goal> {
    if (isDemo) {
        throw new Error('Cannot create goals in demo mode');
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
        .from('goals')
        .insert([{
            user_id: user.id,
            name: goalData.name,
            target_value: goalData.target_value,
            current_value: goalData.current_value,
            unit: goalData.unit,
            start_date: goalData.start_date || null,
            deadline_date: goalData.deadline_date || null,
            status: goalData.status || 'not_started',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }])
        .select()
        .single();

    if (error) {
        console.error('Error creating goal:', error);
        throw error;
    }

    return data as Goal;
}

export async function updateGoal(
    goalId: number,
    updates: UpdateGoalInput,
    isDemo: boolean = false
): Promise<Goal> {
    // if (isDemo) {
    //     throw new Error('Cannot update goals in demo mode');
    // }

    const supabase = createSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
        .from('goals')
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq('id', goalId)
        .eq('user_id', user.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating goal:', error);
        throw error;
    }

    return data as Goal;
}

export async function deleteGoal(goalId: number, isDemo: boolean = false): Promise<void> {
    if (isDemo) {
        throw new Error('Cannot delete goals in demo mode');
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        throw new Error('User not authenticated');
    }

    const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId)
        .eq('user_id', user.id);

    if (error) {
        console.error('Error deleting goal:', error);
        throw error;
    }
}

export async function updateGoalProgress(
    goalId: number,
    newCurrentValue: number,
    isDemo: boolean = false
): Promise<Goal> {
    if (isDemo) {
        throw new Error('Cannot update goal progress in demo mode');
    }

    return updateGoal(goalId, { current_value: newCurrentValue }, isDemo);
}