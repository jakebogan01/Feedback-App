<script>
     import { onMount } from 'svelte';
     import { preferences } from '../../store/preferences';
     import CreateSuggestion from '../../components/CreateSuggestion.svelte';

     let showCreateForm = false;
     let filterArray;
     let suggestions;
     let statuses;

     onMount(async () => {
          if (!$preferences[1]) {
               goto('/');
          }

          const res = await fetch('https://feedback-api-eight.vercel.app/suggestions', {
               method: "GET",
               headers: {
                    Accept: "application.json",
                    "Content-Type": "application/json",
               },
          });
          suggestions = await res.json();

          statuses = suggestions.map((item) => {
               return item.status;
          })

          let unique = [...new Set(statuses)];
          filterArray = [...unique];
     })

     async function update() {
          const res = await fetch('https://feedback-api-eight.vercel.app/suggestions', {
               method: "GET",
               headers: {
                    Accept: "application.json",
                    "Content-Type": "application/json",
               },
          });
          suggestions = await res.json();
     }

     const handleUpdateLikes = async (id, count) => {
          let userEmails = suggestions.filter(item => item._id === id)

          if (!userEmails[0].users_liked.includes($preferences?.[1].email)) {
               count += 1;
               try {
                    const response = await fetch(`https://feedback-api-eight.vercel.app/suggestions/${id}`, {
                         method: "PUT",
                         headers: {
                              Accept: "application.json",
                              "Content-Type": "application/json",
                         },
                         body: JSON.stringify({
                              likes: count,
                              users_liked: [...userEmails[0].users_liked, $preferences?.[1].email]
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

<button type="button" on:click={()=>{showCreateForm = true}}>create new suggestion</button>

{#if showCreateForm}
     <CreateSuggestion bind:showCreateForm={showCreateForm} />
{/if}

{#if suggestions}
     <!-- {#each suggestions as suggestion}
          {#each filterArray as status}
               {#if suggestion?.status === status}
                    <a href="/suggestions/{suggestion?._id}" class="block">
                         {status}
                         <div class="py-4 px-4">
                              <p>{suggestion?.title}</p>
                              <p>{suggestion?.description}</p>
                              <form on:submit|preventDefault|once={()=>{handleUpdateLikes(suggestion?._id, suggestion?.likes)}}>
                                   <button type="submit">{suggestion?.likes}</button>
                              </form>
                              <p>{suggestion?.tag}</p>
                              <p>{suggestion?.comment.length}</p>
                         </div>
                    </a>
                    <hr>
               {/if}
          {/each}
     {/each} -->
{/if}