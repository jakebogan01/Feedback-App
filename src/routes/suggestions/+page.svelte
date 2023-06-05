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
     let darkMode = false;

     const themeSwitch = () => {
          darkMode = !darkMode;

          preferences.update(currentTheme => {
               currentTheme[0].theme = darkMode ? "dark" : "";

               return currentTheme;
          });
     }

     onMount(async () => {
                    const res = await fetch('https://feedback-api-eight.vercel.app/suggestions', {
               method: "GET",
               headers: {
                    Accept: "application.json",
                    "Content-Type": "application/json",
               },
          });
          suggestions = await res.json();

          if (!$preferences[1] && !suggestions) {
               window.location.replace("/");
          }
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

     const logout = () => {
          localStorage.clear();
          window.location.replace("/");
     }
</script>

{#if $preferences[1]}
     <div class="flex flex-col justify-between bg-[#F7F8FE] dark:bg-[#0F172A]" style="height: -webkit-fill-available; min-height: 100dvh;">
          <div class="w-full flex flex-col 1440:flex-row max-w-[69.375rem] mx-auto 1440:space-x-[1.875rem] 1440:pt-[5.875rem] md:px-10">
               
               <div class="flex flex-col md:items-center 1440:items-start md:flex-row 1440:flex-col md:pt-14 1440:pt-0 md:pb-10 md:space-x-[0.625rem] 1440:space-x-0 1440:space-y-6">
                    <Nav bind:openMenu={openMenu} bind:showDropList={showDropList} on:click={showNav} />
          
                    <div class="flex-1 1440:flex-none hidden md:block">
                         <Tags bind:tagFilter={tagFilter} bind:filterByTag={filterByTag} filterByNumbers={filterByNumbers} tags={removeDuplicates(tags)}/>
                    </div>
          
                    <div class="flex-1 1440:flex-none 1440:max-h-[8.5625rem] 1440:min-w-[15.9375rem] hidden md:block ">
                         <div class="bg-white dark:bg-[#1E293B] p-6 md:h-[11.125rem] rounded-[0.625rem]">
                              <div class="flex items-center justify-between">
                                   <h4 class="font-bold text-lg text-[#3A4374] dark:text-white">Roadmap</h4>
                                   <a href="/roadmap" class="font-semibold text-13 text-[#4661E6] hover:text-[#CED7FF] dark:text-[#95A1B8] dark:hover:text-[#4661E6]">View</a>
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
                                                  <span on:keydown={()=>{}} on:click={()=>{filterByStatus = status}} class="text-base text-[#647196] dark:text-[#D1D7E9] dark:hover:text-[#4661E6] cursor-pointer">{status}</span>
                                             </div>
                                             <span class="font-bold text-base text-[#647196] dark:text-[#D1D7E9]">{count[i]}</span>
                                        </div>
                                   {/each}
                              </div>
                         </div>
                    </div>

                    <div class="1440:w-full hidden md:flex flex-row md:flex-col 1440:flex-row items-center space-x-4 md:space-x-0 1440:space-x-4 md:space-y-4 1440:space-y-0 1440:pt-10">
                         <button on:click={logout} type="button" class="flex justify-center items-center bg-white hover:bg-gray-200 dark:bg-[#1E283A] dark:hover:bg-gray-700 dark:text-white p-6 h-[5.0625rem] 1440:h-[4.5rem] w-[4.5rem] 1440:w-full rounded-[0.625rem] cursor-pointer">
                              <span class="sr-only">log out</span>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z" clip-rule="evenodd" /></svg>
                         </button>

                         <button on:click={themeSwitch} type="button" class="flex justify-center items-center bg-white hover:bg-gray-200 dark:hover:bg-gray-700 dark:bg-[#1E283A] dark:text-white p-6 h-[5.0625rem] 1440:h-[4.5rem] w-[4.5rem] 1440:w-full rounded-[0.625rem] cursor-pointer">
                              {#if darkMode}
                                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" /></svg>
                              {:else}
                                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd" /></svg>
                              {/if}
                         </button>
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
                              <div class="flex items-center md:mt-0.5 group">
                                   <label for="filter" class="whitespace-nowrap md:text-sm group-hover:text-[#B9C0CE]">Sort by :</label>
                                   <div class="relative">
                                        <button  type="button" class="relative cursor-pointer bg-transparent text-left ring-0 ring-inset ring-transparent focus:outline-none focus:ring-0 focus:ring-transparent" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label">
                                             <span class="block truncate font-bold text-13 md:text-sm text-[#F3F4FE] group-hover:text-[#B9C0CE] pl-1">{filterByNumbers}</span>
                                             <span class="pointer-events-none absolute inset-y-0 -right-4 flex items-center">
                                                  <svg width="9" height="7" class="w-full" viewBox="0 0 9 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="Path 2" d="M1 1L5 5L9 1" stroke="white" stroke-width="2"/></svg>
                                             </span>
                                        </button>
                                        {#if showDropList}
                                             <ul class="absolute mt-1 overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50" tabindex="-1" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3">
                                                  {#each filterOptions as option}
                                                       <li on:keydown={()=>{}} on:click={()=>{showDropList = false; filterByNumbers = option}} class="text-gray-900 relative select-none py-2 pl-3 pr-9 hover:text-[#AD1FE9] cursor-pointer" id="listbox-option-0" role="option" aria-selected>
                                                            <span class="text-13 block truncate">{option}</span>
                                                       </li>
                                                       <hr>
                                                  {/each}
                                             </ul>
                                        {/if}
                                   </div>
                              </div>
                         </div>
                         <div>
                              <Button bind:showForm={showCreateForm} buttonStyles="bg-[#AD1FE9] hover:bg-[#C75AF6]" buttonText="&#43; Add Feedback" />
                         </div>
                    </div>
               
                    {#if showCreateForm}
                         <CreateSuggestion bind:showCreateForm={showCreateForm} />
                    {/if}
               
                    <main class="relative py-8 overflow-hidden">
                         <div class="md:hidden absolute top-0 bottom-0 min-h-screen bg-[#F7F8FE] dark:bg-[#0F172A] overflow-hidden p-6 w-full z-50 duration-300 ease-in-out {openMenu ? "-right-[0%]" : "-right-full"}">
                              <div class="space-y-6 max-w-[20.3125rem] mx-auto">
                                   <Tags bind:tagFilter={tagFilter} bind:filterByTag={filterByTag} filterByNumbers={filterByNumbers} tags={removeDuplicates(tags)}/>
                                   <div class="bg-white dark:bg-[#1E283A] p-6 md:h-[11.125rem] rounded-[0.625rem]">
                                        <div class="flex items-center justify-between">
                                             <h4 class="font-bold text-lg text-[#3A4374] dark:text-white">Roadmap</h4>
                                             <a href="/roadmap" class="font-semibold text-13 text-[#4661E6] dark:text-[#95A1B8] hover:text-[#CED7FF] dark:hover:text-[#4661E6]">View</a>
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
                                                            <span on:keydown={()=>{}} on:click={()=>{filterByStatus = status}} class="text-base text-[#647196] dark:text-[#D1D7E9] cursor-pointer">{status}</span>
                                                       </div>
                                                       <span class="font-bold text-base text-[#647196] dark:text-[#D1D7E9]">{count[i]}</span>
                                                  </div>
                                             {/each}
                                        </div>
                                   </div>
                                   <div class="flex items-center space-x-4">
                                        <button on:click={logout} type="button" class="bg-white hover:bg-gray-200 dark:bg-[#1E283A] dark:hover:bg-gray-700 dark:text-white p-6 md:h-[11.125rem] rounded-[0.625rem] cursor-pointer">
                                             <span class="sr-only">log out</span>
                                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z" clip-rule="evenodd" /></svg>
                                        </button>

                                        <button on:click={themeSwitch} type="button" class="bg-white hover:bg-gray-200 dark:bg-[#1E283A] dark:hover:bg-gray-700 dark:text-white p-6 md:h-[11.125rem] rounded-[0.625rem] cursor-pointer">
                                             {#if darkMode}
                                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" /></svg>
                                             {:else}
                                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd" /></svg>
                                             {/if}
                                        </button>
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
                                   <div class="flex flex-col items-center justify-center bg-white dark:bg-[#1E293B] py-[4.75rem] md:py-[6.9375rem] px-[1.625rem] text-center rounded-[0.625rem]">
                                        {#if $preferences[0].theme === "dark"}
                                             <img src="/suggestions/illustration-dark-empty.svg" alt="" role="presentation" class="1440:h-[136px]">
                                        {:else}
                                             <img src="/suggestions/illustration-empty.svg" alt="" role="presentation" class="1440:h-[136px]">
                                        {/if}
                                        <div class="md:max-w-[25.625rem]">
                                             <h2 class="font-bold text-lg md:text-2xl text-[#3A4374] dark:text-[#4761E6] leading-none mt-10">There is no feedback yet.</h2>
                                             <p class="text-13 md:text-base text-[#647196] dark:text-[#D1D7E9] my-6 md:mt-4 md:mb-10">Got a suggestion? Found a bug that needs to be squashed? We love hearing about new ideas to improve our app.</p>
                                        </div>
                                        <div>
                                             <Button bind:showForm={showCreateForm} buttonStyles="bg-[#AD1FE9] hover:bg-[#C75AF6]" buttonText="&#43; Add Feedback" />
                                        </div>
                                   </div>
                              {/if}
                         </div>
                    </main>
               </div>
          </div>
          <span class="flex flex-col justify-center sm:flex-row w-full text-center text-gray-300 dark:text-gray-600 text-xs md:text-sm pb-10 pt-[4.8125rem] px-4">
               <span>© 2023 Lead Marvels, Inc. All rights reserved.</span>
               <span><a href="https://leadmarvels.com" class="underline">Home Site</a>.  <a href="https://lmdashboard.com/nova/dashboards/main" class="underline">Dashboard</a></span>
          </span>
     </div>
{/if}