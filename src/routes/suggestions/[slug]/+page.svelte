<script>
     import { onMount } from 'svelte';
     import { preferences } from '../../../store/preferences';
     import { goto } from '$app/navigation';
     import EditSuggestion from '../../../components/EditSuggestion.svelte';
     import BackLink from '../../../components/BackLink.svelte';
     import Button from '../../../components/Button.svelte';
     import Suggestion from '../../../components/Suggestion.svelte';
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
     <main class="bg-[#F7F8FE] px-6 pt-8 pb-[4.8125rem] h-full" style="min-height: 100dvh;">
          <div class="flex items-center justify-between max-w-[43.0625rem] mx-auto">
               <div>
                    <BackLink link="/suggestions" />
               </div>
               <div>
                    {#if suggestion?.user_id == $preferences?.[1]._id}
                         <Button bind:showForm={showEditForm} buttonStyles="bg-[#4761E6]" buttonText="Edit Feedback" />
                    {/if}
               </div>
          </div>

          <section class="space-y-6 mt-12 max-w-[45.625rem] mx-auto">
               <Suggestion suggestion={suggestion} on:submit={()=>{handleUpdateLikes(suggestion?.likes)}} />
               
               {#if suggestion?.comment.length >= 1}
                    <div class="bg-white p-6 rounded-[0.625rem] text-13 space-y-12 md:space-y-6">
                         <h2 class="font-bold text-lg text-[#3A4374] mb-6 md:mb-0">{suggestion?.comment.length} Comments</h2>
                         {#each suggestion?.comment as comment}
                              <div>
                                   <div class="flex items-center justify-between mb-4">
                                        <div class="flex items-center md:items-start">
                                             <div class="flex justify-center items-center bg-[#F2F4FF] text-gray-300 mr-4 rounded-full w-10 h-10 overflow-hidden">
                                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>                            
                                             </div>
                                             <div>
                                                  <div class="text-13 md:text-sm">
                                                       {#if allUsers}
                                                            {#each allUsers as user}
                                                                 {#if user?._id == comment?.user_id}
                                                                      <span class="block font-bold text-[#3A4374]">Mr Coach</span>
                                                                      <span class="block text-[#647196]">{user?.email}</span>
                                                                 {/if}
                                                            {/each}
                                                       {/if}
                                                  </div>
                                                  <p class="hidden md:inline-block text-15 mt-4 text-[#647196]">{comment?.comment}</p>
                                             </div>
                                        </div>
                                        <div>
                                             <button type="button" class="font-semibold text-13 text-[#4661E6]">Reply</button>
                                        </div>
                                   </div>
                                   <p class="md:hidden text-[#647196]">{comment?.comment}</p>
                              </div>
                         {/each}
                    </div>
               {/if}

               <form on:submit|preventDefault={handleCreateComment} class="bg-white p-6 rounded-[0.625rem] text-13">
                    <h2 class="font-bold text-lg text-[#3A4374] mb-6">Add Comment</h2>
                    <div>
                         <label for="description" class="block font-bold text-13 text-[#3A4374] sr-only">Create Comment</label>
                         <div class="mt-3">
                              <textarea type="text" bind:value={commentDescriptoin} rows="3" cols="50" name="commentDescriptoin" id="commentDescriptoin" class="block w-full bg-[#F7F8FE] text-13 md:text-15 text-[#3A4374] p-3 rounded-[0.3125rem] border-0 ring-1 ring-inset ring-transparent placeholder:text-[#8C92B4] focus:ring-2 focus:ring-inset focus:ring-indigo-600" placeholder="Type your comment here" style="resize: none;" required></textarea>
                         </div>
                    </div>
                    <div class="flex items-center justify-between mt-4">
                         <div class="text-13 md:text-15 text-[#647196]">
                              <span>{commentDescriptoin.length} Characters left</span>
                         </div>
                         <button type="submit" class="bg-[#AD1FE9] font-bold text-[#F3F4FE] text-13 md:text-sm rounded-[0.625rem] px-4 py-2.5 whitespace-nowrap">Post Comment</button>
                    </div>
               </form>
          </section>
     </main>
{/if}