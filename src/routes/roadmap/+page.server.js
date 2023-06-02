import { fail } from "@sveltejs/kit";
/** @type {import('./$types').Actions} */

export const actions = {
     createSuggestion: async ({ request }) => {
          const values = await request.formData();

          const stringToSlug = (str) => {
               return str
                    .trim()
                    .toLowerCase()
                    .replace(/[\W_]+/g, "-")
                    .replace(/^-+|-+$/g, "");
          };

          try {
               const title = values.get("title");
               const updatedTitle = stringToSlug(title);
               const tag = values.get("tag");
               const description = values.get("description");

               const response = await fetch("https://feedback-api-eight.vercel.app/suggestions", {
                    method: "POST",
                    headers: {
                         Accept: "application.json",
                         "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                         title: title,
                         slug: updatedTitle,
                         description: description,
                         likes: 0,
                         users_liked: [],
                         tag: tag,
                         status: "Pending",
                         user_id: "6476c7f84f6963d82b8dd94b",
                         comment: [],
                    }),
               });
               return { success: true };
          } catch (error) {
               console.error(error.message);
               return fail(500, { message: "Could not post data" });
          }
     },
};
