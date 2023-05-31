<script>
     import { onMount } from 'svelte';
     import { preferences } from '../../../store/preferences';
     import { goto } from '$app/navigation';
     export let data;

     let suggestion;
     let allUsers;
     
     onMount(async () => {
          if (!$preferences[1]) {
               goto('/');
          }

          const res = await fetch(`https://feedback-api-eight.vercel.app/suggestions/${data?.slug}`, {
               method: "GET",
               headers: {
                    Accept: "application.json",
                    "Content-Type": "application/json",
               },
          });
          suggestion = await res.json();

          const userRes = await fetch('https://feedback-api-eight.vercel.app/users', {
               method: "GET",
               headers: {
                    Accept: "application.json",
                    "Content-Type": "application/json",
               },
          });
          allUsers = await userRes.json();
     });

     async function update() {
          const res = await fetch(`https://feedback-api-eight.vercel.app/suggestions/${data?.slug}`, {
               method: "GET",
               headers: {
                    Accept: "application.json",
                    "Content-Type": "application/json",
               },
          });
          suggestion = await res.json();
     }

     const handleUpdateLikes = async (count) => {
          if (!suggestion.users_liked.includes($preferences?.[1].email)) {
               count += 1;
               try {
                    const response = await fetch(`https://feedback-api-eight.vercel.app/suggestions/${data?.slug}`, {
                         method: "PUT",
                         headers: {
                              Accept: "application.json",
                              "Content-Type": "application/json",
                         },
                         body: JSON.stringify({
                              likes: count,
                              users_liked: [...suggestion.users_liked, $preferences?.[1].email]
                         }),
                    });
                    update();
               } catch (error) {
                    console.error(error.message);
               }
          }
          return;
     }
</script>

{#if suggestion}
     <div class="py-4 px-4">
          <p>{suggestion?.title}</p>
          <p>{suggestion?.description}</p>
          <form on:submit|preventDefault|once={()=>{handleUpdateLikes(suggestion?.likes)}}>
               <button type="submit">{suggestion?.likes}</button>
          </form>
          <p>{suggestion?.tag}</p>
          <p>{suggestion?.comment.length}</p>
     </div>
     
     {#each suggestion?.comment as comment}
          {#if allUsers}
               {#each allUsers as user}
                    {#if user?._id == comment?.user_id}
                         <p>{user?.email}</p>
                    {/if}
               {/each}
          {/if}
          <p>{comment?.comment}</p>     
     {/each}
{/if}