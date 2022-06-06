module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cstmblack: "#020F0D",
        cstmwhite: "#FCFCFC",
        //Template
        cstmred: "#EF476F",
        cstmyellow: "#FFD166",
        cstmblue: "#118AB2",
        cstmlightgreen: "#05F2DB",
        cstmgreen: "#04BFAD",
        cstmdarkergreen: "#0B8C75",
        cstmdarkestgreen: "#0C594B",
        //Lain lain
        cstmbtnlightred: "#FF6C96",
        cstmbtnlightgreen: "#04BFAD",
        cstmglass: "#F6F6F6",
        cstmglass2: "#F9F9F9",
        cstmgray: "#D4D5D6",
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
          small: "0 5px 10px rgba(0, 0, 0, 0.2)",
          default: "0 8px 16px rgba(0, 0, 0, 0.2)",
          large: "0 12px 24px rgba(0, 0, 0, 0.2)",
        },
      },
      backgroundImage: {
        Sign: "url('/assets/main/bg_sign.png')",
      },
      fontFamily: {
        mechsuit: ["Mechsuit"],
        mechano: ["CAMechano"],
        gothambold: ["GothamBold"],
        gothambook: ["GothamBook"],
        gothammedium: ["Gotham"],
      },
      fontSize: {
        "2xs": ".625rem",
        "3xs": ".5rem",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};

// require('@tailwindcss/line-clamp') maybe it can be deleted in the future
