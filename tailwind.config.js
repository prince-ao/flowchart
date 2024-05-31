/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      minHeight: {
        "screen-header": "calc(100vh - 80px)",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          background: "#FAF8F5", // Light gray
          primary: "#1f2937", // Dark/navy blue
          secondary: "#8ac2eb", // light Blue
          accent: "#D97706", // Amber
          neutral: "#374151", // Darker gray
          "base-100": "#FAF8F5", // Light beige
          info: "#3ABFF8", // Light blue
          success: "#36D399", // Green
          warning: "#FBBF24", // Yellow
          error: "#EF4444", // Red
        },
      },
      "light",
    ],
  },
};
