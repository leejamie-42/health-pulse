// lib/hooks/useUserProfile.ts
import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@lib/supabase/client';
import { DEMO_USER_ID } from '@lib/constants';

interface UserProfileData {
    username: string | null;
    email: string | null;
    avatarUrl: string | null;
    loading: boolean;
}

export function useUserProfile(isDemo: boolean = false): UserProfileData {
    const [username, setUsername] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const supabase = createSupabaseClient();

            let userId: string;

            if (isDemo) {
                userId = DEMO_USER_ID;
                const { data: demoProfile } = await supabase
                    .from('profiles')
                    .select('email, avatar_url, username')
                    .eq('id', DEMO_USER_ID)
                    .single();

                if (demoProfile) {
                    setEmail(demoProfile.email);
                    setAvatarUrl(demoProfile.avatar_url);
                    setUsername(demoProfile.username);
                }
            } else {
                const { data: userData } = await supabase.auth.getUser();
                if (userData.user) {
                    userId = userData.user.id;
                    setEmail(userData.user.email || null);

                    // Fetch profile to get avatar and username
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('avatar_url, username')
                        .eq('id', userData.user.id)
                        .single();

                    if (profile) {
                        setAvatarUrl(profile.avatar_url);
                        setUsername(profile.username);
                    }
                }
            }

            setLoading(false);
        };

        fetchUserProfile();
    }, [isDemo]);

    return { username, email, avatarUrl, loading };
}