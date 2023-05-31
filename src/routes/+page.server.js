import { fail } from "@sveltejs/kit";
/** @type {import('./$types').Actions} */

export const actions = {
     // updateSuggestion: async ({ request }) => {
     //
     // },
     // deleteSuggestion: async (event) => {
     //
     // },
     register: async ({ request }) => {
          const values = await request.formData();

          try {
               const email = values.get("email");
               const password = values.get("password");

               const response = await fetch("https://feedback-api-eight.vercel.app/users", {
                    method: "POST",
                    headers: {
                         Accept: "application.json",
                         "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                         email: email,
                         password: password,
                    }),
               });
               return { success: true };
          } catch (error) {
               console.error(error.message);
               return fail(500, { message: "Could not post data" });
          }
     },
};
