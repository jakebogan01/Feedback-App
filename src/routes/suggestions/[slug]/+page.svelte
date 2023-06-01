<script>
     import { onMount } from 'svelte';
     import { preferences } from '../../../store/preferences';
     import { goto } from '$app/navigation';
     import EditSuggestion from '../../../components/EditSuggestion.svelte';
     import { comment } from 'svelte/internal';
     export let data;

     let suggestion;
     let allUsers;
     let showEditForm = false;
     let commentDescriptoin = '';
     
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

     const handleCreateComment = async () => {
          try {
               const response = await fetch(`https://feedback-api-eight.vercel.app/suggestions/${data?.slug}`, {
                    method: "PUT",
                    headers: {
                         Accept: "application.json",
                         "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                         comment: [...suggestion.comment, { 
                              comment: commentDescriptoin,
                              user_id: $preferences?.[1]._id
                         }]
                    }),
               });
               update();
          } catch (error) {
               console.error(error.message);
          }
     }
</script>

{#if showEditForm && suggestion}
     <EditSuggestion post={suggestion} bind:showEditForm={showEditForm} />
{/if}

{#if suggestion}
     {#if suggestion?.user_id == $preferences?.[1]._id}
          <button type="button" on:click={()=>{showEditForm = true}}>Edit Suggestion</button>
     {/if}


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

<form on:submit|preventDefault={handleCreateComment} class="mt-10">
     <textarea type="text" bind:value={commentDescriptoin} name="commentDescriptoin" id="commentDescriptoin" placeholder="e.g. Web Design" required />
     <button type="submit" class="inline-flex w-full justify-center items-center rounded-md bg-[#635FC7] px-3 h-10 text-sm font-semibold text-white shadow-sm hover:bg-[#A8A4FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2">Add feedback</button>
</form>