<script>
     import { onMount, afterUpdate } from 'svelte';
     import { preferences } from '../../store/preferences';
     import { goto } from '$app/navigation';
     import CreateSuggestion from '../../components/CreateSuggestion.svelte';
     import Nav from '../../components/Nav.svelte';
     import Suggestion from '../../components/Suggestion.svelte';
     import Button from '../../components/Button.svelte';

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
     let openMenu = false;

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

     const showNav = () => {
          openMenu = !openMenu;
     }
</script>

<div class="bg-[#F7F8FE] h-full">
     <Nav bind:openMenu={openMenu} bind:showDropList={showDropList} on:click={showNav} />

     <div class="relative flex items-center justify-between px-6 py-2 bg-[#10263E] z-50" on:keydown={()=>{}} on:click|self={()=>{showDropList = false}}>
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
                         <ul class="absolute mt-1 overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50" tabindex="-1" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3">
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
               <Button bind:showForm={showCreateForm} buttonStyles="bg-[#AD1FE9]" buttonText="&#43; Add Feedback" />
          </div>
     </div>

     <main class="relative px-6 py-8 overflow-hidden">
          <div class="fixed inset-0 bg-black w-full min-h-screen bg-opacity-50 transition {openMenu ? "opacity-100 z-30" : "opacity-0 z-0"}"></div>

          <div class="absolute space-y-6 right-0 top-0 bottom-0 min-h-screen bg-[#F7F8FE] overflow-hidden p-6 max-w-[16.9375rem] z-50 transition {openMenu ? "translate-x-0 opacity-100" : "translate-x-60 opacity-0"}">
               <div class="flex flex-wrap justify-evenly bg-white p-6 rounded-[0.625rem] gap-x-2 gap-y-3.5">
                    <span on:keydown={()=>{}} on:click={()=>{tagFilter = false; filterByTag = ''; filterByNumbers = ''}} class="block bg-[#F2F4FF] rounded-[0.625rem] px-4 py-1 font-semibold text-[#4661E6]">All</span>
                    {#each removeDuplicates(tags) as tag}
                         <span on:keydown={()=>{}} on:click={()=>{tagFilter = true; filterByTag = tag; filterByNumbers = ''}} class="block bg-[#F2F4FF] rounded-[0.625rem] px-4 py-1 font-semibold text-[#4661E6]">{tag}</span>
                    {/each}
               </div>
               <div class="bg-white p-6 rounded-[0.625rem]">
                    <div class="flex items-center justify-between">
                         <h4 class="font-bold text-lg text-[#3A4374]">Roadmap</h4>
                         <a href="/" class="font-semibold text-13 text-[#4661E6]">View</a>
                    </div>
                    <div class="mt-4">
                         {#each removeDuplicates(statuses) as status}
                              <div class="flex items-center justify-between">
                                   <div class="flex items-center">
                                        <div class="w-2 h-2 bg-[#F49F85] rounded-full mr-2"></div>
                                        <span on:keydown={()=>{}} on:click={()=>{filterByStatus = status}} class="text-base text-[#647196]">{status}</span>
                                   </div>
                                   <span class="font-bold text-base text-[#647196]">2</span>
                              </div>
                         {/each}
                    </div>
               </div>
          </div>

          <div class="relative space-y-4 {openMenu ? "z-0" : "z-50"}">
               {#if suggestions && suggestions.length >= 1}
                    {#each copiedSuggestions as suggestion}
                         {#if suggestion.status == filterByStatus}
                              {#if suggestion.tag == filterByTag && tagFilter}
                                   <Suggestion suggestion={suggestion} on:submit={()=>{handleUpdateLikes(suggestion?._id, suggestion?.likes)}} />
                              {:else if !tagFilter}
                                   <Suggestion suggestion={suggestion} on:submit={()=>{handleUpdateLikes(suggestion?._id, suggestion?.likes)}} />
                              {/if}
                         {/if}
                    {/each}
               {:else}
                    <div class="flex flex-col items-center justify-center bg-white py-[4.75rem] px-[1.625rem] text-center rounded-[0.625rem]">
                         <img src="/suggestions/illustration-empty.svg" alt="">
                         <h2 class="font-bold text-lg text-[#3A4374] leading-none mt-10">There is no feedback yet.</h2>
                         <p class="text-13 text-[#647196] my-6">Got a suggestion? Found a bug that needs to be squashed? We love hearing about new ideas to improve our app.</p>
                         <div>
                              <Button bind:showForm={showCreateForm} buttonStyles="bg-[#AD1FE9]" buttonText="&#43; Add Feedback" />
                         </div>
                    </div>
               {/if}
          </div>
     </main>


     {#if showCreateForm}
          <CreateSuggestion bind:showCreateForm={showCreateForm} />
     {/if}

     <!-- <div class="hidden md:block">
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
     </div> -->
</div>