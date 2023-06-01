<script>
     import { onMount, afterUpdate } from 'svelte';
     import { preferences } from '../../store/preferences';
     import { goto } from '$app/navigation';
     import CreateSuggestion from '../../components/CreateSuggestion.svelte';
     import Nav from '../../components/Nav.svelte';
     import Suggestion from '../../components/Suggestion.svelte';

     let suggestions;
     let updatedSuggestions;
     let tagFilter = false;
     let filterByTag = '';
     let filterByNumbers = 'Most Upvotes';
     let filterByStatus = 'Pending';
     let tags;
     let statuses;
     let showCreateForm = false;
     let showDropList = false
     let filterOptions = ['Most Upvotes', 'Least Upvotes', 'Most Comments', 'Least Comments'];

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
          if (suggestions) {
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

<div class="bg-[#F7F8FE] h-full">
     <Nav bind:showDropList={showDropList} />

     <div class="flex items-center justify-between px-6 py-2 bg-[#10263E]" on:keydown={()=>{}} on:click|self={()=>{showDropList = false}}>
          <div class="flex items-center text-13 text-[#F3F4FE]">
               <label for="filter" class="whitespace-nowrap">Sort by :</label>
               <div class="relative">
                    <button on:click={()=>{showDropList = !showDropList}} type="button" class="relative cursor-pointer bg-transparent text-left ring-0 ring-inset ring-transparent focus:outline-none focus:ring-0 focus:ring-transparent" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label">
                         <span class="block truncate font-bold text-13 text-[#F3F4FE] pl-1">{filterByNumbers}</span>
                         <span class="pointer-events-none absolute inset-y-0 -right-4 flex items-center">
                              <svg width="9" height="7" class="w-full" viewBox="0 0 9 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="Path 2" d="M1 1L5 5L9 1" stroke="white" stroke-width="2"/></svg>
                         </span>
                    </button>
                    {#if showDropList}
                         <ul class="absolute mt-1 overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10" tabindex="-1" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3">
                              {#each filterOptions as option}
                                   <li on:keydown={()=>{}} on:click={()=>{showDropList = false; filterByNumbers = option}} class="text-gray-900 relative cursor-default select-none py-2 pl-3 pr-9 hover:text-gray-400" id="listbox-option-0" role="option" aria-selected>
                                        <span class="text-13 block truncate">{option}</span>
                                   </li>
                              {/each}
                         </ul>
                    {/if}
               </div>
          </div>
          <div>
               <button type="button" on:click={()=>{showCreateForm = true}} class="bg-[#AD1FE9] font-bold text-13 text-[#F2F4FE] whitespace-nowrap py-2.5 px-4 rounded-[0.625rem]">&#43; Add Feedback</button>
          </div>
     </div>

     <main class="px-6 py-8 space-y-4">
          {#if suggestions}
               {#each copiedSuggestions as suggestion}
                    {#if suggestion.status == filterByStatus}
                         {#if suggestion.tag == filterByTag && tagFilter}
                              <Suggestion suggestion={suggestion} on:submit={()=>{handleUpdateLikes(suggestion?._id, suggestion?.likes)}} />
                         {:else if !tagFilter}
                              <Suggestion suggestion={suggestion} on:submit={()=>{handleUpdateLikes(suggestion?._id, suggestion?.likes)}} />
                         {/if}
                    {/if}
               {/each}
          {/if}
     </main>


     {#if showCreateForm}
          <CreateSuggestion bind:showCreateForm={showCreateForm} />
     {/if}

     <div class="hidden md:block">
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
     </div>
</div>