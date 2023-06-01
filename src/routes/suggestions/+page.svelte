<script>
     import { onMount, afterUpdate } from 'svelte';
     import { preferences } from '../../store/preferences';
     import { goto } from '$app/navigation';
     import CreateSuggestion from '../../components/CreateSuggestion.svelte';

     let suggestions;
     let updatedSuggestions;
     let tagFilter = false;
     let filterByTag = '';
     let filterByNumbers = '';
     let filterByStatus = 'Pending';
     let tags;
     let statuses;
     let showCreateForm = false;

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
     });

     async function update() {
          const res = await fetch('https://feedback-api-eight.vercel.app/suggestions', {
               method: "GET",
               headers: {
                    Accept: "application.json",
                    "Content-Type": "application/json",
               },
          });
          updatedSuggestions = await res.json();
          suggestions = [...updatedSuggestions]
     }

     const removeDuplicates = (ar) => {
          let unique = [...new Set(ar)];
          return unique.filter(e => e);
     }

     afterUpdate(()=>{
          if (suggestions) {
               tags = suggestions.map((item) => {
                    if (item.status == filterByStatus) {
                         return item.tag;
                    }
               })

               statuses = suggestions.map((item) => {
                    return item.status;
               })
          }
     })

     let copiedSuggestions = [];
     $: {
          copiedSuggestions = suggestions;
          if (filterByNumbers == 'Least Upvotes') {
               copiedSuggestions.sort((a, b) => parseFloat(a.likes) - parseFloat(b.likes));
          }
          if (filterByNumbers == 'Most Upvotes') {
               copiedSuggestions.sort((a, b) => parseFloat(b.likes) - parseFloat(a.likes));
          }
          if (filterByNumbers == 'Least Comments') {
               copiedSuggestions.sort((a, b) => parseFloat(a.comment.length) - parseFloat(b.comment.length));
          }
          if (filterByNumbers == 'Most Comments') {
               copiedSuggestions.sort((a, b) => parseFloat(b.comment.length) - parseFloat(a.comment.length));
          }
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

<div>
     <label for="filter" class="block text-sm font-medium leading-6 text-gray-900">Filter by:</label>
     <select bind:value={filterByNumbers} id="filter" name="filter" class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <option></option>
          <option>Most Upvotes</option>
          <option>Least Upvotes</option>
          <option>Most Comments</option>
          <option>Least Comments</option>
     </select>
</div>

{#if suggestions}
     {#each copiedSuggestions as suggestion}
          {#if suggestion.status == filterByStatus}
               {#if suggestion.tag == filterByTag && tagFilter}
                    <a href="/suggestions/{suggestion?._id}" class="block" data-sveltekit-preload-data="hover">
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
               {:else if !tagFilter}
                    <a href="/suggestions/{suggestion?._id}" class="block" data-sveltekit-preload-data="hover">
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
          {/if}
     {/each}
{/if}

<div>
     <h2>Tags:</h2>
     <p on:keydown={()=>{}} on:click={()=>{tagFilter = false; filterByTag = ''; filterByNumbers = ''}}>All</p>
     {#each removeDuplicates(tags) as tag}
          <p on:keydown={()=>{}} on:click={()=>{tagFilter = true; filterByTag = tag; filterByNumbers = ''}}>{tag}</p>
     {/each}
</div>

<div class="pt-4">
     <h2>statuses:</h2>
     {#each removeDuplicates(statuses) as status}
          <p on:keydown={()=>{}} on:click={()=>{filterByStatus = status}}>{status}</p>
     {/each}
</div>