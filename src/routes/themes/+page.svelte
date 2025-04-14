<script lang="ts">
    import { currentTheme, type Theme, applyThemeToDocument } from '$lib/stores/themeStore';
    import { onMount } from 'svelte';

    let currentThemeValue: Theme;
    currentTheme.subscribe(value => {
        currentThemeValue = value;
    });

    const themes: Theme[] = [
        {
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
            preview: '/themes/nebula.png'
        },
        {
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
            preview: '/themes/daylight.png'
        },
        {
            id: 'royal-purple',
            name: 'Royal Purple',
            description: 'Elegant purple theme with royal aesthetics',
            type: 'dark',
            colors: {
                primary: '#9D4EDD',
                secondary: '#7B2CBF',
                background: '#240046',
                text: '#E0AAFF',
                accent: '#C77DFF'
            },
            preview: '/themes/royal-purple.png'
        },
        {
            id: 'lavender-light',
            name: 'Lavender Light',
            description: 'Soft purple theme with a gentle touch',
            type: 'light',
            colors: {
                primary: '#7C3AED',
                secondary: '#8B5CF6',
                background: '#F5F3FF',
                text: '#4C1D95',
                accent: '#6D28D9'
            },
            preview: '/themes/lavender-light.png'
        },
        {
            id: 'crimson',
            name: 'Crimson',
            description: 'Bold and powerful red theme',
            type: 'dark',
            colors: {
                primary: '#DC2626',
                secondary: '#EF4444',
                background: '#18020C',
                text: '#FEE2E2',
                accent: '#B91C1C'
            },
            preview: '/themes/crimson.png'
        },
        {
            id: 'coral-light',
            name: 'Coral Light',
            description: 'Warm and inviting red theme',
            type: 'light',
            colors: {
                primary: '#EF4444',
                secondary: '#F87171',
                background: '#FEF2F2',
                text: '#7F1D1D',
                accent: '#DC2626'
            },
            preview: '/themes/coral-light.png'
        },
        {
            id: 'ocean',
            name: 'Ocean',
            description: 'Deep blue theme inspired by the sea',
            type: 'dark',
            colors: {
                primary: '#0EA5E9',
                secondary: '#38BDF8',
                background: '#082F49',
                text: '#E0F2FE',
                accent: '#0284C7'
            },
            preview: '/themes/ocean.png'
        },
        {
            id: 'sky-light',
            name: 'Sky Light',
            description: 'Fresh blue theme like a clear sky',
            type: 'light',
            colors: {
                primary: '#0EA5E9',
                secondary: '#38BDF8',
                background: '#F0F9FF',
                text: '#075985',
                accent: '#0284C7'
            },
            preview: '/themes/sky-light.png'
        },
        {
            id: 'forest',
            name: 'Forest',
            description: 'A soothing green theme inspired by nature',
            type: 'dark',
            colors: {
                primary: '#4CAF50',
                secondary: '#81C784',
                background: '#1B2821',
                text: '#C8E6C9',
                accent: '#66BB6A'
            },
            preview: '/themes/forest.png'
        },
        {
            id: 'sunset',
            name: 'Sunset',
            description: 'Warm and inviting colors of a sunset',
            type: 'light',
            colors: {
                primary: '#FF9800',
                secondary: '#FFA726',
                background: '#FFF3E0',
                text: '#424242',
                accent: '#FF7043'
            },
            preview: '/themes/sunset.png'
        }
    ];
</script>

<div class="min-h-screen bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-base-content mb-4">Theme Gallery</h1>
            <p class="text-base-content/70">Choose your preferred theme from our collection</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {#each themes as theme}
                <div class="card bg-base-200 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 ease-in-out">
                    <figure class="relative h-48">
                        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-base-200/30">
                            <div class="w-full h-full" style="background-color: {theme.colors.background};">
                                <div class="flex items-center justify-center h-full space-x-4">
                                    <div class="w-8 h-8 rounded-full" style="background-color: {theme.colors.primary}"></div>
                                    <div class="w-8 h-8 rounded-full" style="background-color: {theme.colors.secondary}"></div>
                                    <div class="w-8 h-8 rounded-full" style="background-color: {theme.colors.accent}"></div>
                                </div>
                            </div>
                        </div>
                    </figure>

                    <div class="card-body items-center text-center">
                        <h2 class="card-title text-base-content mb-2">{theme.name}</h2>
                        <p class="text-base-content/80 mb-4">{theme.description}</p>
                        <div class="flex items-center justify-center gap-2 mb-4">
                            <span class="badge badge-outline">{theme.type}</span>
                        </div>
                        <div class="card-actions justify-center">
                            <button 
                                class="btn btn-primary w-full"
                                class:btn-active={currentThemeValue?.id === theme.id}
                                on:click={() => applyThemeToDocument(theme)}
                            >
                                {#if currentThemeValue?.id === theme.id}
                                    Current Theme
                                {:else}
                                    Apply Theme
                                {/if}
                            </button>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    .card {
        backdrop-filter: blur(10px);
        transition: all 0.3s ease-in-out;
    }

    .card:hover {
        transform: translateY(-4px);
    }

    .card-body {
        padding: 1.5rem;
    }

    .badge {
        text-transform: capitalize;
    }
</style> 