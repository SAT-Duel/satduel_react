import {useState} from 'react';

// Dark/light theme for the public (non-logged-in) pages. Manual toggle,
// auto-initialized from the OS preference, persisted in localStorage.
export default function useSdTheme() {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('sd-theme');
        if (saved === 'light' || saved === 'dark') return saved;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    });
    const toggleTheme = () => setTheme((t) => {
        const next = t === 'dark' ? 'light' : 'dark';
        localStorage.setItem('sd-theme', next);
        return next;
    });
    return [theme, toggleTheme];
}
