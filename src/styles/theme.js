// Styled-components theme, aligned with the Tailwind design tokens in index.css.
// Legacy pages read from this; new pages use Tailwind classes directly.
const theme = {
    colors: {
        primary: '#7c3aed',
        secondary: '#5a21b6',
        text: {
            light: '#ffffff',
            dark: '#1e293b',
        },
        background: {
            light: '#fafafa',
            dark: '#0f172a',
        },
        accent: {
            purple: '#8250f4',
            blue: '#6366f1',
        },
    },
    gradients: {
        primary: 'linear-gradient(135deg, #7c3aed 0%, #5a21b6 100%)',
        accent: 'linear-gradient(90deg, #8250f4, #6366f1)',
        card: 'linear-gradient(135deg, #faf9ff 0%, #ebe5ff 100%)',
    },
    shadows: {
        small: '0 1px 3px rgba(15, 23, 42, 0.08)',
        medium: '0 4px 12px rgba(15, 23, 42, 0.08)',
        large: '0 12px 32px rgba(15, 23, 42, 0.10)',
    },
    animations: {
        hover: 'all 0.2s ease',
    },
    borderRadius: {
        small: '10px',
        medium: '14px',
        large: '20px',
    },
};

export default theme;
