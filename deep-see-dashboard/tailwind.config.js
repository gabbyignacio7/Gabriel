/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Priority Tiers
        'tier-0': '#FF0000', // Red - Emergency
        'tier-1': '#FFA500', // Orange - Fast Track
        'tier-2': '#FFFF00', // Yellow - Standard
        'tier-3': '#ADD8E6', // Light Blue - Custom
        'tier-4': '#D3D3D3', // Gray - Backlog

        // Status Colors
        'status-not-started': '#D3D3D3',
        'status-in-progress': '#87CEEB',
        'status-blocked': '#FF0000',
        'status-completed': '#90EE90',
        'status-cancelled': '#D3D3D3',

        // Revenue Impact
        'revenue-negative': '#FF0000',
        'revenue-positive': '#90EE90',
        'revenue-neutral': '#FFFFFF',
      },
    },
  },
  plugins: [],
}
