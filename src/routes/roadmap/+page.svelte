<script>
     import { onMount } from 'svelte';
     import { preferences } from '../../store/preferences';
     import CreateSuggestion from '../../components/CreateSuggestion.svelte';
     import BackLink from '../../components/BackLink.svelte';
     import Button from '../../components/Button.svelte';
     import Suggestion from '../../components/Suggestion.svelte';
     import { goto } from '$app/navigation';
     import RoadmapSuggestions from '../../components/RoadmapSuggestions.svelte';

     let showCreateForm = false;
     let suggestions;
     let statuses = ['Pending', 'In-Progress', 'Live'];
     let currentStatus = 'Pending';

     onMount(async () => {
          if (!$preferences[1]) {
               window.location.replace("/");
          }

          const res = await fetch('https://feedback-api-eight.vercel.app/suggestions', {
               method: "GET",
               headers: {
                    Accept: "application.json",
                    "Content-Type": "application/json",
               },
          });
          suggestions = await res.json();
     })

     let pendingCount = 0;
     let inProgressCount = 0;
     let liveCount = 0;

     $: {
          if (suggestions) {
               pendingCount = suggestions.reduce(function (r, a) {
                    return r + +(a.status === 'Pending');
               }, 0);
               inProgressCount = suggestions.reduce(function (r, a) {
                    return r + +(a.status === 'In-Progress');
               }, 0);
               liveCount = suggestions.reduce(function (r, a) {
                    return r + +(a.status === 'Live');
               }, 0);
          }
     }
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

<div class="bg-[#F7F8FE] dark:bg-[#0F172A] md:pt-14 md:px-10 h-full" style="min-height: 100dvh;">
     <section class="relative flex items-center justify-between max-w-[69.375rem] mx-auto md:rounded-[0.625rem] px-6 py-6 md:px-9 md:py-8 bg-[#10263E] z-50">
          <div class="text-13 text-[#F3F4FE]">
               <BackLink link="/" linkStyles="text-white" />
               <h1 class="font-bold text-lg md:text-2xl md:mt-2">Roadmap</h1>
          </div>
          <div>
               <Button bind:showForm={showCreateForm} buttonStyles="bg-[#AD1FE9] hover:bg-[#C75AF6]" buttonText="&#43; Add Feedback" />
          </div>
     </section>

     {#if showCreateForm}
          <CreateSuggestion bind:showCreateForm={showCreateForm} />
     {/if}

     {#if suggestions}
          <main class="h-screen max-w-[69.375rem] mx-auto md:mt-8 1440:mt-12">
               <div class="md:hidden flex items-center text-center font-bold text-13 text-[#394273] dark:text-[#4761E6]">
                    <button on:click={()=>{currentStatus = status = 'Pending'}} type="button" class="{currentStatus === "Pending" ? "opacity-100" : " opacity-40"} block relative flex-1 py-4">
                         Pending ({pendingCount})
                         <div class="absolute bottom-0 left-0 right-0 w-full h-1 bg-[#F49F85]"></div>
                    </button>
                    <button on:click={()=>{currentStatus = status = 'In-Progress'}} type="button" class="{currentStatus === "In-Progress" ? "opacity-100" : " opacity-40"} block relative flex-1 py-4">
                         In-Progress ({inProgressCount})
                         <div class="absolute bottom-0 left-0 right-0 w-full h-1 bg-[#AD1FE9]"></div>
                    </button>
                    <button on:click={()=>{currentStatus = status = 'Live'}} type="button" class="{currentStatus === "Live" ? "opacity-100" : " opacity-40"} block relative flex-1 py-4">
                         Live ({liveCount})
                         <div class="absolute bottom-0 left-0 right-0 w-full h-1 bg-[#63BCFB]"></div>
                    </button>
               </div>

               <section class="md:hidden px-6 pt-8 pb-[4.8125rem]">
                    {#each statuses as status}
                         {#if currentStatus === status}
                              <div class="mb-6">
                                   <h2 class="font-bold text-lg text-[3A4374] dark:text-white">{status}</h2>
                                   <span class="text-13 text-[#647196] dark:text-[#D1D7E9]">Features currently being developed</span>
                              </div>
                              <div class="space-y-4">
                                   {#each suggestions as suggestion}
                                        {#if suggestion?.status === status}
                                             <Suggestion currentStatus={status} suggestion={suggestion} on:submit={()=>{handleUpdateLikes(suggestion?._id, suggestion?.likes)}} />
                                        {/if}
                                   {/each}
                              </div>
                         {/if}
                    {/each}
               </section>

               <div class="hidden md:grid grid-cols-3 gap-4 gap-x-[0.625rem] 1440:gap-x-[1.875rem]">
                    {#each statuses as status}
                         <div>
                              <div class="font-bold text-sm 1440:text-lg text-[#3A4374] mb-6 1440:mb-8 text-center">
                                   {#if status === "Pending"}
                                        <span class="block text-[#F49F85]">{status} ({pendingCount})</span>
                                        <span class="font-normal text-sm 1440:text-base text-[#647196] dark:text-[#D1D7E9]">Ideas prioritized for research</span>
                                   {:else if status === "In-Progress"}
                                        <span class="block text-[#AD1FE9]">{status} ({inProgressCount})</span>
                                        <span class="font-normal text-sm 1440:text-base text-[#647196] dark:text-[#D1D7E9]">Currently being developed</span>
                                   {:else if status === "Live"}
                                        <span class="block text-[#63BCFB]">{status} ({liveCount})</span>
                                        <span class="font-normal text-sm 1440:text-base text-[#647196] dark:text-[#D1D7E9]">Released features</span>
                                   {/if}
                              </div>
                              <div class="space-y-6">
                                   {#each suggestions as suggestion}
                                        {#if suggestion?.status === status}
                                             <RoadmapSuggestions currentStatus={status} suggestion={suggestion} on:submit={()=>{handleUpdateLikes(suggestion?._id, suggestion?.likes)}} />
                                        {/if}
                                   {/each}
                              </div>
                         </div>
                    {/each}
               </div>
          </main>
     {/if}
     <span class="block text-center text-gray-300 text-sm pb-10">© 2023 Lead Marvels, Inc. All rights reserved.  <a href="https://leadmarvels.com" class="underline">Home Site</a>.  <a href="https://lmdashboard.com/nova/dashboards/main" class="underline">Dashboard</a></span>
</div>