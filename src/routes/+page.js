export const load = async ({ fetch }) => {
     const fetchUsers = async () => {
          const response = await fetch("https://feedback-api-eight.vercel.app/users", {
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
          users: fetchUsers(),
     };
};
