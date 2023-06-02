<script>
     import { onMount } from 'svelte';
     import { preferences } from '../../store/preferences';
     import CreateSuggestion from '../../components/CreateSuggestion.svelte';
     import BackLink from '../../components/BackLink.svelte';
     import Button from '../../components/Button.svelte';
     import Suggestion from '../../components/Suggestion.svelte';
     import { goto } from '$app/navigation';

     let showCreateForm = false;
     let suggestions;
     let statuses = ['Pending', 'In-Progress', 'Live'];
     let currentStatus = 'Pending';

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

<div>
     <section class="relative flex items-center justify-between px-6 py-2 bg-[#10263E] py-[1.875rem] z-50">
          <div class="text-13 text-[#F3F4FE]">
               <BackLink link="/" linkStyles="text-white" />
               <h1 class="font-bold text-lg">Roadmap</h1>
          </div>
          <div>
               <Button bind:showForm={showCreateForm} buttonStyles="bg-[#AD1FE9]" buttonText="&#43; Add Feedback" />
          </div>
     </section>

     {#if showCreateForm}
          <CreateSuggestion bind:showCreateForm={showCreateForm} />
     {/if}

     {#if suggestions}
          <main class="bg-[#F7F8FE] h-screen">
               <div class="flex items-center text-center font-bold text-13 text-[#394273]">
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

               <section class="px-6 pt-8 pb-[4.8125rem]">
                    {#each statuses as status}
                         {#if currentStatus === status}
                              <div class="mb-6">
                                   <h2 class="font-bold text-lg text-[3A4374]">{status}</h2>
                                   <span class="text-13 text-[#647196]">Features currently being developed</span>
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

               <!-- {#each filterArray as status}
                    <div class="border border-red-500">
                         {status}
                         {#each suggestions as suggestion}
                              {#if suggestion?.status === status}
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
                         {/each}
                    </div>
               {/each} -->
          </main>
     {/if}
</div>