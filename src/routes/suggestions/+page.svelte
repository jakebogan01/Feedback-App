<script>
     import { onMount, afterUpdate } from 'svelte';
     import { preferences } from '../../store/preferences';
     import { goto } from '$app/navigation';
     import CreateSuggestion from '../../components/CreateSuggestion.svelte';
     import Nav from '../../components/Nav.svelte';
     import Suggestion from '../../components/Suggestion.svelte';
     import Button from '../../components/Button.svelte';
     import Tags from '../../components/Tags.svelte';

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
     <div class="flex flex-col 1440:flex-row max-w-[69.375rem] mx-auto 1440:space-x-[1.875rem] 1440:pt-[5.875rem] md:px-10">
          
          <div class="flex flex-col md:flex-row 1440:flex-col md:items-center md:pt-14 1440:pt-0 md:pb-10 md:space-x-[0.625rem] 1440:space-x-0 1440:space-y-6">
               <Nav bind:openMenu={openMenu} bind:showDropList={showDropList} on:click={showNav} />
     
               <div class="flex-1 1440:flex-none hidden md:block">
                    <Tags bind:tagFilter={tagFilter} bind:filterByTag={filterByTag} filterByNumbers={filterByNumbers} tags={removeDuplicates(tags)}/>
               </div>
     
               <div class="flex-1 1440:flex-none 1440:max-h-[8.5625rem] 1440:min-w-[15.9375rem] hidden md:block ">
                    <div class="bg-white p-6 md:h-[11.125rem] rounded-[0.625rem]">
                         <div class="flex items-center justify-between">
                              <h4 class="font-bold text-lg text-[#3A4374]">Roadmap</h4>
                              <a href="/roadmap" class="font-semibold text-13 text-[#4661E6]">View</a>
                         </div>
                         <div class="mt-4 1440:mt-6">
                              {#each statuses as status, i}
                                   <div class="flex items-center justify-between">
                                        <div class="flex items-center">
                                             {#if status === "Pending"}
                                                  <div class="w-2 h-2 bg-[#F49F85] rounded-full mr-3"></div>
                                             {:else if status === "In-Progress"}
                                                  <div class="w-2 h-2 bg-[#AD1FE9] rounded-full mr-3"></div>
                                             {:else if status === "Live"}
                                                  <div class="w-2 h-2 bg-[#63BCFB] rounded-full mr-3"></div>
                                             {/if}
                                             <span on:keydown={()=>{}} on:click={()=>{filterByStatus = status}} class="text-base text-[#647196] cursor-pointer">{status}</span>
                                        </div>
                                        <span class="font-bold text-base text-[#647196]">{count[i]}</span>
                                   </div>
                              {/each}
                         </div>
                    </div>
               </div>
          </div>
     
          <div class="flex-1">
               <div class="relative flex items-center justify-between md:rounded-[0.625rem] px-6 py-2 md:py-3.5 md:px-3 1440:px-4 1440:py-4 bg-[#10263E] z-50" on:keydown={()=>{}} on:click|self={()=>{showDropList = false}}>
                    <div on:keydown={()=>{}} on:click={()=>{showDropList = !showDropList}} class="flex items-center text-13 text-[#F3F4FE]">
                         <div class="hidden md:flex items-center mr-10">
                              <img src="/suggestions/icon-suggestions.svg" alt="" role="presentation" class="mr-4">
                              {#if suggestions}
                                   <span class="font-bold text-white text-lg">{suggestions.length} Suggestions</span>
                              {/if}
                         </div>
                         <div class="flex items-center md:mt-0.5">
                              <label for="filter" class="whitespace-nowrap md:text-sm">Sort by :</label>
                              <div class="relative">
                                   <button  type="button" class="relative cursor-pointer bg-transparent text-left ring-0 ring-inset ring-transparent focus:outline-none focus:ring-0 focus:ring-transparent" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label">
                                        <span class="block truncate font-bold text-13 md:text-sm text-[#F3F4FE] pl-1">{filterByNumbers}</span>
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
                    </div>
                    <div>
                         <Button bind:showForm={showCreateForm} buttonStyles="bg-[#AD1FE9]" buttonText="&#43; Add Feedback" />
                    </div>
               </div>
          
               {#if showCreateForm}
                    <CreateSuggestion bind:showCreateForm={showCreateForm} />
               {/if}
          
               <main class="relative py-8 h-screen overflow-hidden">
                    <div class="md:hidden absolute top-0 bottom-0 min-h-screen bg-[#F7F8FE] overflow-hidden p-6 w-full z-50 duration-300 ease-in-out {openMenu ? "-right-[0%]" : "-right-full"}">
                         <div class="space-y-6 max-w-[20.3125rem] mx-auto">
                              <Tags bind:tagFilter={tagFilter} bind:filterByTag={filterByTag} filterByNumbers={filterByNumbers} tags={removeDuplicates(tags)}/>
                              <div class="bg-white p-6 md:h-[11.125rem] rounded-[0.625rem]">
                                   <div class="flex items-center justify-between">
                                        <h4 class="font-bold text-lg text-[#3A4374]">Roadmap</h4>
                                        <a href="/roadmap" class="font-semibold text-13 text-[#4661E6]">View</a>
                                   </div>
                                   <div class="mt-4">
                                        {#each statuses as status, i}
                                             <div class="flex items-center justify-between">
                                                  <div class="flex items-center">
                                                       {#if status === "Pending"}
                                                            <div class="w-2 h-2 bg-[#F49F85] rounded-full mr-3"></div>
                                                       {:else if status === "In-Progress"}
                                                            <div class="w-2 h-2 bg-[#AD1FE9] rounded-full mr-3"></div>
                                                       {:else if status === "Live"}
                                                            <div class="w-2 h-2 bg-[#63BCFB] rounded-full mr-3"></div>
                                                       {/if}
                                                       <span on:keydown={()=>{}} on:click={()=>{filterByStatus = status}} class="text-base text-[#647196] cursor-pointer">{status}</span>
                                                  </div>
                                                  <span class="font-bold text-base text-[#647196]">{count[i]}</span>
                                             </div>
                                        {/each}
                                   </div>
                              </div>
                         </div>
                    </div>
          
                    <div class="relative space-y-4 px-6 md:px-0">
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
                              <div class="flex flex-col items-center justify-center bg-white py-[4.75rem] md:py-[6.9375rem] px-[1.625rem] text-center rounded-[0.625rem]">
                                   <img src="/suggestions/illustration-empty.svg" alt="" role="presentation" class="1440:h-[136px]">
                                   <div class="md:max-w-[25.625rem]">
                                        <h2 class="font-bold text-lg md:text-2xl text-[#3A4374] leading-none mt-10">There is no feedback yet.</h2>
                                        <p class="text-13 md:text-base text-[#647196] my-6 md:mt-4 md:mb-10">Got a suggestion? Found a bug that needs to be squashed? We love hearing about new ideas to improve our app.</p>
                                   </div>
                                   <div>
                                        <Button bind:showForm={showCreateForm} buttonStyles="bg-[#AD1FE9]" buttonText="&#43; Add Feedback" />
                                   </div>
                              </div>
                         {/if}
                    </div>
               </main>
          </div>
     </div>
</div>