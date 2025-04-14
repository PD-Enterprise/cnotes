<script lang="ts">
    import { currentTheme, applyThemeToDocument, previewTheme } from '$lib/stores/themeStore';
    import type { Theme } from '$lib/stores/themeStore';
    import { onMount } from 'svelte';
    
    // Sample themes
    const themes: Theme[] = [
        {
            id: 'quantum',
            name: 'Quantum',
            description: 'Futuristic light theme with quantum-inspired colors',
            type: 'light',
            colors: {
                primary: '#4A90E2',
                secondary: '#50E3C2',
                background: '#F8F9FA',
                text: '#2C3E50',
                accent: '#9013FE'
            },
            preview: 'quantum-preview'
        },
        {
            id: 'neon',
            name: 'Neon Pulse',
            description: 'Vibrant light theme with neon accents',
            type: 'light',
            colors: {
                primary: '#FF00FF',
                secondary: '#00FFFF',
                background: '#FFFFFF',
                text: '#333333',
                accent: '#FF0099'
            },
            preview: 'neon-preview'
        },
        {
            id: 'cyber',
            name: 'Cyber Light',
            description: 'Clean, minimalist light theme with cyber aesthetics',
            type: 'light',
            colors: {
                primary: '#00BCD4',
                secondary: '#3F51B5',
                background: '#F5F5F5',
                text: '#212121',
                accent: '#FF4081'
            },
            preview: 'cyber-light-preview'
        },
        {
            id: 'void',
            name: 'Void',
            description: 'Deep space dark theme with cosmic colors',
            type: 'dark',
            colors: {
                primary: '#6C63FF',
                secondary: '#2A2A72',
                background: '#121212',
                text: '#E0E0E0',
                accent: '#FF6B6B'
            },
            preview: 'void-preview'
        },
        {
            id: 'matrix',
            name: 'Matrix',
            description: 'Classic green-on-black matrix aesthetic',
            type: 'dark',
            colors: {
                primary: '#00FF00',
                secondary: '#003300',
                background: '#000000',
                text: '#00FF00',
                accent: '#00CC00'
            },
            preview: 'matrix-preview'
        },
        {
            id: 'nebula',
            name: 'Nebula',
            description: 'Cosmic dark theme with purple and blue hues',
            type: 'dark',
            colors: {
                primary: '#9D4EDD',
                secondary: '#3C096C',
                background: '#10002B',
                text: '#E0AAFF',
                accent: '#C77DFF'
            },
            preview: 'nebula-preview'
        }
    ];

    let selectedTheme: Theme | null = null;
    let isPreviewMode = false;
    let activeTab: 'light' | 'dark' = 'light';
    let isApplying = false;
    let successMessage = '';
    let currentAppliedTheme: Theme | null = null;

    onMount(() => {
        // Check if there's a saved theme
        const savedTheme = localStorage.getItem('selectedTheme');
        if (savedTheme) {
            try {
                const theme = JSON.parse(savedTheme);
                // Find the matching theme in our themes array
                const matchingTheme = themes.find(t => t.id === theme.id);
                if (matchingTheme) {
                    currentAppliedTheme = matchingTheme;
                }
            } catch (e) {
                console.error('Failed to parse saved theme:', e);
            }
        }
    });

    function applyTheme(theme: Theme) {
        selectedTheme = theme;
        isPreviewMode = true;
        
        // Apply the theme to preview without saving
        document.documentElement.style.setProperty('--primary', theme.colors.primary);
        document.documentElement.style.setProperty('--secondary', theme.colors.secondary);
        document.documentElement.style.setProperty('--background', theme.colors.background);
        document.documentElement.style.setProperty('--text', theme.colors.text);
        document.documentElement.style.setProperty('--accent', theme.colors.accent);
    }

    function resetPreview() {
        isPreviewMode = false;
        selectedTheme = null;
        
        // Restore the current applied theme
        if (currentAppliedTheme) {
            document.documentElement.style.setProperty('--primary', currentAppliedTheme.colors.primary);
            document.documentElement.style.setProperty('--secondary', currentAppliedTheme.colors.secondary);
            document.documentElement.style.setProperty('--background', currentAppliedTheme.colors.background);
            document.documentElement.style.setProperty('--text', currentAppliedTheme.colors.text);
            document.documentElement.style.setProperty('--accent', currentAppliedTheme.colors.accent);
        }
    }

    function setActiveTab(tab: 'light' | 'dark') {
        activeTab = tab;
    }

    function applySelectedTheme() {
        if (!selectedTheme) return;
        
        isApplying = true;
        
        // Apply the theme permanently
        applyThemeToDocument(selectedTheme);
        currentTheme.set(selectedTheme);
        currentAppliedTheme = selectedTheme;
        
        // Show success message
        successMessage = `Theme "${selectedTheme.name}" applied successfully!`;
        
        // Reset after a delay
        setTimeout(() => {
            isApplying = false;
            successMessage = '';
            resetPreview();
        }, 2000);
    }

    $: filteredThemes = themes.filter(theme => theme.type === activeTab);
</script>

<div class="container mx-auto px-4 py-8 pt-32">
    <h1 class="text-4xl font-bold mb-8 border-b border-primary pb-2 inline-block">Theme Gallery</h1>
    
    {#if successMessage}
        <div class="alert alert-success mb-6 shadow-lg">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{successMessage}</span>
            </div>
        </div>
    {/if}
    
    {#if isPreviewMode && selectedTheme}
        <div class="preview-mode mb-8 p-4 rounded-lg shadow-lg" style="background-color: {selectedTheme.colors.background}; color: {selectedTheme.colors.text};">
            <h2 class="text-2xl font-semibold mb-4" style="color: {selectedTheme.colors.primary}">Preview: {selectedTheme.name}</h2>
            <div class="preview-content p-6 rounded-lg border" style="border-color: {selectedTheme.colors.accent};">
                <h3 style="color: {selectedTheme.colors.primary}; font-size: 1.5rem; margin-bottom: 1rem;">Sample Heading</h3>
                <p class="my-4">This is how your notes will look with this theme. The colors and styling are carefully chosen to provide the best reading experience.</p>
                <div class="flex gap-4 mt-6">
                    <button class="px-4 py-2 rounded" style="background-color: {selectedTheme.colors.primary}; color: white;">
                        Primary Button
                    </button>
                    <button class="px-4 py-2 rounded" style="background-color: {selectedTheme.colors.accent}; color: white;">
                        Accent Button
                    </button>
                </div>
            </div>
            <div class="mt-4 flex gap-4">
                <button class="btn" style="background-color: {selectedTheme.colors.secondary}; color: white;" on:click={() => resetPreview()}>Back to Gallery</button>
                <button class="btn" style="background-color: {selectedTheme.colors.primary}; color: white;" on:click={applySelectedTheme} disabled={isApplying}>
                    {#if isApplying}
                        <span class="loading loading-spinner"></span>
                        Applying...
                    {:else}
                        Apply Theme
                    {/if}
                </button>
            </div>
        </div>
    {:else}
        <div class="tabs tabs-boxed mb-6">
            <button 
                class="tab {activeTab === 'light' ? 'tab-active glow-light' : ''}" 
                on:click={() => setActiveTab('light')}
            >
                <span class="tab-icon">☀️</span> Light Themes
            </button>
            <button 
                class="tab {activeTab === 'dark' ? 'tab-active glow-dark' : ''}" 
                on:click={() => setActiveTab('dark')}
            >
                <span class="tab-icon">🌙</span> Dark Themes
            </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each filteredThemes as theme}
                <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div class="card-body">
                        <h2 class="card-title border-b border-primary pb-2">{theme.name}</h2>
                        <p class="text-sm opacity-80">{theme.description}</p>
                        <div class="color-preview mt-4 flex gap-2">
                            {#each Object.entries(theme.colors) as [name, color]}
                                <div class="w-6 h-6 rounded-full" style="background-color: {color};" title={name}></div>
                            {/each}
                        </div>
                        <div class="card-actions justify-end mt-4">
                            <button class="btn btn-primary" on:click={() => applyTheme(theme)}>Preview Theme</button>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .color-preview {
        display: flex;
        gap: 0.5rem;
    }
    
    .preview-content {
        transition: all 0.3s ease;
    }
    
    .card {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .card:hover {
        transform: translateY(-5px);
    }
    
    .tabs {
        display: flex;
        justify-content: center;
    }
    
    .tab {
        padding: 0.5rem 1.5rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
    }
    
    .tab-active {
        background-color: var(--primary);
        color: white;
    }
    
    .glow-light {
        box-shadow: 0 0 10px #FFD700, 0 0 20px rgba(255, 215, 0, 0.5);
    }
    
    .glow-dark {
        box-shadow: 0 0 10px #6C63FF, 0 0 20px rgba(108, 99, 255, 0.5);
    }
    
    .tab-icon {
        font-size: 1.2rem;
    }
</style> 