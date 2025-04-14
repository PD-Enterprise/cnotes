import { writable } from 'svelte/store';

export interface Theme {
    id: string;
    name: string;
    description: string;
    type: 'light' | 'dark';
    colors: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
        accent: string;
    };
    preview: string;
}

type ThemeType = 'light' | 'dark';

// Default themes
const DEFAULT_DARK_THEME: Theme = {
    id: 'nebula',
    name: 'Nebula',
    description: 'A beautiful cosmic theme with deep blues and purples',
    type: 'dark',
    colors: {
        primary: '#6C63FF',
        secondary: '#4A90E2',
        background: '#1A1B26',
        text: '#A9B1D6',
        accent: '#BB9AF7'
    },
    preview: 'nebula-preview.png'
};

const DEFAULT_LIGHT_THEME: Theme = {
    id: 'daylight',
    name: 'Daylight',
    description: 'A clean, light theme for better readability',
    type: 'light',
    colors: {
        primary: '#4A90E2',
        secondary: '#6C63FF',
        background: '#FFFFFF',
        text: '#2D3748',
        accent: '#805AD5'
    },
    preview: 'daylight-preview.png'
};

// Create a writable store for the current theme
export const currentTheme = writable<Theme>(DEFAULT_DARK_THEME);

function createThemeStore() {
    const { subscribe, set } = writable<ThemeType>('dark');

    const applyTheme = (theme: Theme) => {
        if (typeof window === 'undefined') return;
        
        // Set CSS variables
        document.documentElement.style.setProperty('--primary', theme.colors.primary);
        document.documentElement.style.setProperty('--secondary', theme.colors.secondary);
        document.documentElement.style.setProperty('--background', theme.colors.background);
        document.documentElement.style.setProperty('--text', theme.colors.text);
        document.documentElement.style.setProperty('--accent', theme.colors.accent);
        
        // Set theme attribute
        document.documentElement.setAttribute('data-theme', theme.type);
        
        // Save to localStorage
        localStorage.setItem('theme', theme.type);
        localStorage.setItem('selectedTheme', JSON.stringify(theme));
        
        // Update stores
        currentTheme.set(theme);
        set(theme.type);
    };

    return {
        subscribe,
        setTheme: (theme: Theme) => {
            applyTheme(theme);
        },
        toggleTheme: () => {
            currentTheme.update(theme => {
                const newTheme = theme.type === 'light' ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME;
                applyTheme(newTheme);
                return newTheme;
            });
        },
        initialize: () => {
            if (typeof window === 'undefined') return;
            
            const savedTheme = localStorage.getItem('selectedTheme');
            
            if (savedTheme) {
                try {
                    const parsedTheme = JSON.parse(savedTheme);
                    applyTheme(parsedTheme);
                } catch (e) {
                    console.error('Failed to parse saved theme:', e);
                    applyTheme(DEFAULT_DARK_THEME);
                }
            } else {
                applyTheme(DEFAULT_DARK_THEME);
            }
        }
    };
}

export const themeStore = createThemeStore();
export const toggleTheme = () => themeStore.toggleTheme();

// Initialize theme on module load if we're in a browser environment
if (typeof window !== 'undefined') {
    themeStore.initialize();
}

// Function to apply a theme to the document
export function applyThemeToDocument(theme: Theme) {
    themeStore.setTheme(theme);
}

// Function to load the saved theme from localStorage
export function loadSavedTheme(): Theme {
    if (typeof window === 'undefined') return DEFAULT_DARK_THEME;
    
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        try {
            return JSON.parse(savedTheme);
        } catch (e) {
            console.error('Failed to parse saved theme:', e);
            return DEFAULT_DARK_THEME;
        }
    }
    return DEFAULT_DARK_THEME;
}

// Function to preview a theme
export function previewTheme(theme: Theme) {
    applyThemeToDocument(theme);
}

// Function to reset to default theme
export function resetToDefaultTheme() {
    applyThemeToDocument(DEFAULT_DARK_THEME);
} 