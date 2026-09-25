import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          base: "#050510",
          panel: "rgba(10, 10, 25, 0.7)",
          acrylic: "rgba(15, 15, 30, 0.65)"
        },
        border: {
          DEFAULT: "rgba(65, 105, 225, 0.3)",
          focus: "rgba(65, 105, 225, 0.8)",
          subtle: "rgba(255, 255, 255, 0.08)"
        },
        text: {
          primary: "#ffffff",
          secondary: "#a0a0b0",
          muted: "#606070",
          accent: "#4169e1"
        },
        action: {
          primary: "#4169e1",
          hover: "#5a7df0",
          danger: "#ff3366",
          success: "#00c853"
        }
      },
      fontFamily: {
        sans: ["'IBM Plex Sans JP'", "'M PLUS 1'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        'ambient': '0 4px 30px rgba(0, 0, 0, 0.5)',
        'glow': '0 0 15px rgba(65, 105, 225, 0.25)',
      },
    },
  },
  plugins: [],
} satisfies Config
