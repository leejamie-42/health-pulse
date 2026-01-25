// lib/data/profile.ts
import { createSupabaseClient } from '@lib/supabase/client';
import { DEMO_USER_ID } from '@lib/constants';

export interface UserProfile {
    id: string;
    email: string;
    username: string | null;
    avatar_url: string | null;
    birthday: string | null;
    height_cm: number | null;
    weight_kg: number | null;
    gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
    fitness_level: 'beginner' | 'intermediate' | 'advanced' | null;
    is_demo: boolean;
    onboarding_complete: boolean;
}

export async function getUserProfile(isDemo: boolean = false) {
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
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        if (isDemo) {
            return null;
        }
        throw error;
    }

    return data as UserProfile;
}

export async function updateUserProfile(profile: Partial<UserProfile>, isDemo: boolean = false) {
    if (isDemo) {
        throw new Error('Cannot update profile in demo mode');
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        throw new Error('User not authenticated');
    }

    // add updated_at timestamp
    const updateData = {
        ...profile,
        updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select();

    if (error) {
        throw error;
    }

    return data?.[0] || null;
}

export async function uploadAvatar(file: File, isDemo: boolean = false) {
    if (isDemo) {
        throw new Error('Cannot upload avatar in demo mode');
    }

    const supabase = createSupabaseClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        throw new Error('User not authenticated');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/avatar.${fileExt}`;

    // Delete old avatar if exists
    await supabase.storage.from('avatars').remove([fileName]);

    // Upload new avatar
    const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true
        });

    if (error) {
        throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

    // Update profile with new avatar URL
    await updateUserProfile({ avatar_url: publicUrl });

    return publicUrl;
}

export async function updatePassword(newPassword: string, isDemo: boolean = false) {
    if (isDemo) {
        throw new Error('Cannot update password in demo mode');
    }

    const supabase = createSupabaseClient();

    const { error } = await supabase.auth.updateUser({
        password: newPassword
    });

    if (error) {
        throw error;
    }
}