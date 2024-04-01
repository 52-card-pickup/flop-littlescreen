import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        french_gray: {
          DEFAULT: "#d0ccd0",
          100: "#2b282b",
          200: "#564f56",
          300: "#817781",
          400: "#a9a2a9",
          500: "#d0ccd0",
          600: "#dad7da",
          700: "#e3e1e3",
          800: "#ecebec",
          900: "#f6f5f6",
        },
        white: {
          DEFAULT: "#fbfcff",
          100: "#001965",
          200: "#0032ca",
          300: "#3064ff",
          400: "#95afff",
          500: "#fbfcff",
          600: "#fbfcff",
          700: "#fcfdff",
          800: "#fdfdff",
          900: "#fefeff",
        },
        wenge: {
          DEFAULT: "#605856",
          100: "#131211",
          200: "#272423",
          300: "#3a3534",
          400: "#4d4746",
          500: "#605856",
          600: "#837976",
          700: "#a29a98",
          800: "#c1bcba",
          900: "#e0dddd",
        },
        cerulean: {
          DEFAULT: "#1c6e8c",
          100: "#06161c",
          200: "#0b2c38",
          300: "#114254",
          400: "#165870",
          500: "#1c6e8c",
          600: "#279bc6",
          700: "#54b9dd",
          800: "#8dd0e8",
          900: "#c6e8f4",
        },
        charcoal: {
          DEFAULT: "#274156",
          100: "#080d12",
          200: "#101a23",
          300: "#182835",
          400: "#203546",
          500: "#274156",
          600: "#3f6a8d",
          700: "#6191b8",
          800: "#95b5d0",
          900: "#cadae7",
        },
      },
      animation: {
        shake: "shake 0.82s cubic-bezier(.36,.07,.19,.97) both",
      },
      keyframes: {
        shake: {
          "10%, 90%": {
            transform: "translate3d(-1px, 0, 0)",
          },
          "20%, 80%": {
            transform: "translate3d(2px, 0, 0)",
          },
          "30%, 50%, 70%": {
            transform: "translate3d(-4px, 0, 0)",
          },
          "40%, 60%": {
            transform: "translate3d(4px, 0, 0)",
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
