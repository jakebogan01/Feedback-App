import { persisted } from "svelte-local-storage-store";

export const preferences = persisted("preferences", [
     {
          // email: "test@gmail.com",
          theme: "light",
     },
     // {
     //      createdAt: "2023-05-29T16:57:48.455Z",
     //      email: "test@gmail.com",
     //      password: "sdfd",
     //      updatedAt: "2023-05-29T16:57:48.455Z",
     //      __v: 0,
     //      _id: "6474d98cc6a9f1fc0b66791d",
     // },
]);
