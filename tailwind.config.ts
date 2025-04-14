import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import daisyui from "daisyui";

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors: {
        'bihu-accent': {
          light: '#FFF3D6',
          border: '#FFE4B5'
        }
      },
      animation: {
        'bihu-tilt': 'tilt 0.2s ease-in-out'
      },
      keyframes: {
        tilt: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(0.5deg)' }
        }
      }
    }
  },

  plugins: [typography, forms, containerQueries, daisyui],
  daisyui: {
    themes: ["light", "dark"]
  }
} satisfies Config;
