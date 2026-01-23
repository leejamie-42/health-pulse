// lib/hooks/useTheme.ts
import { useEffect, useState } from 'react';

export function useTheme() {
    const [theme, setTheme] = useState<'emerald' | 'forest'>('emerald');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'emerald' | 'forest' | null;
        const initialTheme = savedTheme || 'emerald';

        setTheme(initialTheme);
        document.documentElement.setAttribute('data-theme', initialTheme);
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'emerald' ? 'forest' : 'emerald';
        setTheme(newTheme);

        localStorage.setItem('theme', newTheme);

        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return { theme, toggleTheme, mounted };
}