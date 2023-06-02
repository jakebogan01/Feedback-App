<script>
     import { onMount, afterUpdate } from 'svelte';
     import { preferences } from '../../store/preferences';
     import { goto } from '$app/navigation';
     import CreateSuggestion from '../../components/CreateSuggestion.svelte';
     import Nav from '../../components/Nav.svelte';
     import Suggestion from '../../components/Suggestion.svelte';
     import Button from '../../components/Button.svelte';
     import Tags from '../../components/Tags.svelte';
     import Statuses from '../../components/Statuses.svelte';

     let suggestions;
     let updatedSuggestions;
     let tagFilter = false;
     let filterByTag = '';
     let filterByNumbers = 'Most Upvotes';
     let filterByStatus = 'Pending';
     let tags;
     let statuses = ['Pending', 'In-Progress', 'Live'];
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
          }
     })

     let pendingCount = 0;
     let inProgressCount = 0;
     let liveCount = 0;
     let count = [];
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

               pendingCount = suggestions.reduce(function (r, a) {
                    return r + +(a.status === 'Pending');
               }, 0);
               inProgressCount = suggestions.reduce(function (r, a) {
                    return r + +(a.status === 'In-Progress');
               }, 0);
               liveCount = suggestions.reduce(function (r, a) {
                    return r + +(a.status === 'Live');
               }, 0);

               count = [pendingCount, inProgressCount, liveCount]
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
     <div class="flex flex-col md:flex-row md:items-center max-w-[43.0625rem] mx-auto md:pt-14 md:pb-10 md:space-x-[0.625rem]">
          <Nav bind:openMenu={openMenu} bind:showDropList={showDropList} on:click={showNav} />

          <div class="flex-1 hidden md:block">
               <Tags bind:tagFilter={tagFilter} bind:filterByTag={filterByTag} filterByNumbers={filterByNumbers} tags={removeDuplicates(tags)}/>
          </div>

          <div class="flex-1 hidden md:block">
               <Statuses statuses={statuses} filterByStatus={filterByStatus} count={count} />
          </div>
     </div>

     <div class="relative flex items-center justify-between px-6 py-2 bg-[#10263E] z-50" on:keydown={()=>{}} on:click|self={()=>{showDropList = false}}>
          <div on:keydown={()=>{}} on:click={()=>{showDropList = !showDropList}} class="flex items-center text-13 text-[#F3F4FE]">
               <label for="filter" class="whitespace-nowrap">Sort by :</label>
               <div class="relative">
                    <button  type="button" class="relative cursor-pointer bg-transparent text-left ring-0 ring-inset ring-transparent focus:outline-none focus:ring-0 focus:ring-transparent" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label">
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

     {#if showCreateForm}
          <CreateSuggestion bind:showCreateForm={showCreateForm} />
     {/if}

     <main class="relative px-6 py-8 h-screen overflow-hidden">
          {#if openMenu}
               <div class="md:hidden fixed inset-0 bg-black w-full min-h-screen bg-opacity-50 transition z-30"></div>
          {/if}

          <div class="md:hidden absolute space-y-6 right-0 top-0 bottom-0 min-h-screen bg-[#F7F8FE] overflow-hidden p-6 w-full max-w-[16.9375rem] z-50 transition {openMenu ? "translate-x-0 opacity-100" : "translate-x-60 opacity-0"}">
               <Tags bind:tagFilter={tagFilter} bind:filterByTag={filterByTag} filterByNumbers={filterByNumbers} tags={removeDuplicates(tags)}/>
               <Statuses statuses={statuses} filterByStatus={filterByStatus} count={count} />
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