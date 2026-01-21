// src/app/test-supabase.tsx
'use client';

import { useEffect } from 'react';
import { supabase } from 'lib/supabase/client';

export default function TestSupabase() {
    useEffect(() => {
        const run = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*');

            console.log(data, error);
        };

        run();
    }, []);

    return <div>Check console</div>;
}
