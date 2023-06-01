/** @type {import('tailwindcss').Config} */
export default {
     content: ["./src/**/*.{html,js,svelte,ts}"],
     theme: {
          extend: {
               fontFamily: {
                    jost: ["Jost", "sans-serif"],
               },
               fontSize: {
                    13: "0.8125rem",
                    15: "0.9375rem",
               },
               lineHeight: {
                    19: "1.1875rem",
                    22: "1.375rem",
               },
               screens: {
                    1440: "1440px",
               },
          },
     },
     plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography"), require("@tailwindcss/aspect-ratio")],
};
