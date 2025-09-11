import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./_components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "login-bg": "url('../public/login-background-min.jpg')"
      },

      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        primary: '#2563eb', // blue-600
        primaryDark: '#1e40af', // blue-800
        secondary: '#f59e42', // orange-400
        secondaryDark: '#ea580c', // orange-600
        accent: '#10b981', // emerald-500
        background: '#f9fafb', // gray-50
        surface: '#ffffff', // white
        border: '#e5e7eb', // gray-200
        text: '#111827', // gray-900
        muted: '#6b7280', // gray-500
        error: '#ef4444', // red-500
        success: '#22c55e', // green-500
      },
    },
  },
  plugins: [],
};
export default config;
