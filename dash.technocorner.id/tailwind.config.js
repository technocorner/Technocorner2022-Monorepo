module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        grey: {
          unClick: "#fcfcfc50",
        },
        black: {
          lighter: "#0f1f1c70",
          light: "#0F1F1C",
          default: "#0F1F1C",
        },
        white: {
          light: "#FFFFFF",
          default: "#FCFCFC",
          dark: "#D4D5D6",
        },
        green: {
          light: "#05F2DB",
          default: "#04BFAD",
          dark: "#0B8C75",
          darker: "#0C594B",
        },
        blue: {
          light: "#07A6D1",
          default: "#118AB2",
          dark: "#027493",
        },
        yellow: {
          light: "#F9CD87",
          default: "#FFD166",
          dark: "#EDB74C",
        },
        red: {
          light: "#FF6C96",
          default: "#EF476F",
          dark: "#D13462",
        },
      },
      dropShadow: {
        card: {
          small: "0 5px 5px rgba(0, 0, 0, 0.1)",
          default: "0 8px 8px rgba(0, 0, 0, 0.1)",
          large: "0 12px 12px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};

// require('@tailwindcss/line-clamp') maybe it can be deleted in the future
