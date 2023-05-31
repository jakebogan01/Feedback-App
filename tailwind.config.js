/** @type {import('tailwindcss').Config} */
export default {
     content: ["./src/**/*.{html,js,svelte,ts}"],
     theme: {
          extend: {
               //  fontFamily: {
               //       spartan: ["League Spartan", "sans-serif"],
               //  },
               //  fontSize: {
               //       13: "0.8125rem",
               //       15: "0.9375rem",
               //  },
               //  lineHeight: {
               //       15: "0.9375rem",
               //       18: "1.125rem",
               //       22: "1.375rem",
               //       33: "2.0625rem",
               //  },
               //  screens: {
               //       1440: "1440px",
               //  },
          },
     },
     plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography"), require("@tailwindcss/aspect-ratio")],
};
