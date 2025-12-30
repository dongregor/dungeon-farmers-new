/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        'guild-gold': '#D4AF37',
        'quest-blue': '#4A90D9',
        'loot-purple': '#9B59B6',
        'danger-red': '#E74C3C',
        'success-green': '#27AE60',
        'common': '#9CA3AF',
        'uncommon': '#22C55E',
        'rare': '#3B82F6',
        'epic': '#A855F7',
        'legendary': '#F59E0B',
        'mythic': '#EF4444',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
}