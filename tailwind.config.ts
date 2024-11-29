import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        watercourse: {
          "50": "#ebfef6",
          "100": "#d0fbe7",
          "200": "#a4f6d3",
          "300": "#6aebbd",
          "400": "#2fd8a1",
          "500": "#0abf8a",
          "600": "#009b71",
          "700": "#007357",
          "800": "#03624b",
          "900": "#04503f",
          "950": "#012d25",
        },
        mystic: {
          "50": "#f5f9fa",
          "100": "#e2ecf0",
          "200": "#d0e2e7",
          "300": "#a7c9d2",
          "400": "#77adb9",
          "500": "#5693a1",
          "600": "#437786",
          "700": "#37606d",
          "800": "#31515b",
          "900": "#2c454e",
          "950": "#1d2e34",
        },
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
        pop: "pop 1.5s cubic-bezier(.36,.07,.19,.97) 1",
        float: "float .5s cubic-bezier(.36,.07,.19,.97) 5",
        shake: "shake 0.82s cubic-bezier(.36,.07,.19,.97) both",
        scaleIn: "scaleIn 3s ease-in-out",
        fadeIn: "fadeIn 1s ease-in-out",
        fadeInFromTop:
          "hidden 1s linear, fadeIn 1s 1s ease-in-out, fromTop 2s ease-in-out",
        fadeInFromBottom:
          "hidden 1s linear, fadeIn 1s 1s ease-in-out, fromBottom 2s ease-in-out",
        glitchLayer1: "glitchLayer1 750ms infinite",
        glitchLayer2: "glitchLayer2 750ms infinite",
        glitchLayer3:
          "glitchLayer3 11.3s ease 2000ms normal none infinite running",
      },
      fontFamily: {
        emoji: ['"Noto Emoji"', ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        pop: {
          "0%": {
            transform: "scale(1)",
          },
          "20%": {
            transform: "scale(1.1)",
          },
          "40%": {
            transform: "scale(.9)",
          },
          "60%": {
            transform: "scale(1.05)",
          },
          "80%": {
            transform: "scale(.95)",
          },
          "100%": {
            transform: "scale(1)",
          },
        },
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
        float: {
          "0%": {
            transform: "translateY(0)",
          },
          "25%": {
            transform: "translateY(-5px)",
          },
          "50%": {
            transform: "translateY(0)",
          },
          "75%": {
            transform: "translateY(5px)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
        hidden: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "0",
          },
        },
        scaleIn: {
          "0%": {
            transform: "scale(1.1)",
          },
          "100%": {
            transform: "scale(1)",
          },
        },
        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        fromTop: {
          "0%": {
            transform: "translateY(-33%)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
        fromBottom: {
          "0%": {
            transform: "translateY(33%)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
        glitchLayer1: {
          "0%": {
            transform: "translate(0)",
          },
          "40%": {
            transform: "translate(-2px)",
          },
          "80%": {
            transform: "translate(2px)",
          },
          "100%": {
            transform: "translate(0)",
          },
        },
        glitchLayer2: {
          "0%": {
            transform: "translate(0)",
          },
          "40%": {
            transform: "translate(2px)",
          },
          "80%": {
            transform: "translate(-2px)",
          },
          "100%": {
            transform: "translate(0)",
          },
        },
        glitchLayer3: {
          "30%": {},
          "40%": {
            opacity: "1",
            transform: "scale(1, 1) skew(0, 0)",
          },
          "40.25%": {
            opacity: "0.8",
            transform: "scale(1, 1.2) skew(40deg, 0)",
          },
          "40.5%": {
            opacity: "0.8",
            transform: "scale(1, 1.2) skew(-25deg, 0)",
          },
          "40.75%": {
            opacity: "1",
            transform: "scale(1, 1) skew(0, 0)",
          },
          "65%": {},
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
