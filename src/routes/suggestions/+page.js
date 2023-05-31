export const load = async ({ fetch }) => {
     const fetchSuggestions = async () => {
          const response = await fetch("https://feedback-api-eight.vercel.app/suggestions", {
               method: "GET",
               headers: {
                    Accept: "application.json",
                    "Content-Type": "application/json",
               },
          });
          const data = await response.json();
          return {
               data: data,
          };
     };

     return {
          suggestions: fetchSuggestions(),
     };
};
