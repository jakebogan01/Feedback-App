<script>
     import { onMount } from 'svelte';
     import BackLink from './BackLink.svelte';
     export let showCreateForm;

     let suggestions;
     let tags = ['Feature', 'UI', 'UX', 'Bug', 'Enhancement'];
     let fields = {title: '', tag: '', description: ''};

     onMount(async () => {
          const res = await fetch(`https://feedback-api-eight.vercel.app/suggestions`, {
               method: "GET",
               headers: {
                    Accept: "application.json",
                    "Content-Type": "application/json",
               },
          });
          suggestions = await res.json();
     });
</script>

{#if suggestions}
     <div class="fixed inset-0 bg-[#F7F8FE] dark:bg-[#0F172A] w-full px-6 pt-8 pb-[4.8125rem] z-50 overflow-y-auto min-h-screen" style="z-index: 100;" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="max-w-[33.75rem] mx-auto">
               <BackLink bind:showCreateForm={showCreateForm} />
               <form method="POST" action="?/createSuggestion" enctype="multipart/form-data" class="relative bg-white dark:bg-[#1E293B] p-6 rounded-[0.625rem] mt-12 md:mt-16">
                    <img src="/shared/icon-new-feedback.svg" alt="" role="presentation" class="absolute -top-5 md:-top-7 h-10 md:h-14">
                    <div class="mt-6 md:mt-8">
                         <h3 class="font-bold text-lg md:text-2xl text-[#3A4374] dark:text-[#4761E6]" id="modal-title">Create New Feedback</h3>
                         <div class="mt-6 md:mt-16 space-y-6">
                              <div>
                                   <label for="title" class="block font-bold text-13 md:text-sm text-[#3A4374] dark:text-white">Feedback Title</label>
                                   <span class="text-13 md:text-sm text-[#647196] dark:text-[#D1D7E9]">Add a short, descriptive headline</span>
                                   <div class="mt-3">
                                        <input type="text" bind:value={fields.title} name="title" id="title" class="block w-full bg-[#F7F8FE] dark:bg-[#151E2C] text-13 md:text-15 text-[#3A4374] dark:text-[#8C92B4] p-3 rounded-[0.3125rem] border-0 ring-1 placeholder:text-[#3A4374] ring-inset ring-transparent focus:ring-2 focus:ring-inset focus:ring-indigo-600" required>
                                   </div>
                              </div>
                              <div>
                                   <label for="tag" class="block font-bold text-13 md:text-sm text-[#3A4374] dark:text-white">Category</label>
                                   <span class="text-13 md:text-sm text-[#647196] dark:text-[#D1D7E9]">Choose a category for your feedback</span>
                                   <div class="mt-3">
                                        <select id="tag" bind:value={fields.tag} name="tag" class="block w-full bg-[#F7F8FE] dark:bg-[#151E2C] text-13 md:text-15 text-[#3A4374] dark:text-[#8C92B4] p-3 rounded-[0.3125rem] border-0 ring-1 placeholder:text-[#3A4374] ring-inset ring-transparent focus:ring-2 focus:ring-inset focus:ring-indigo-600">
                                             {#each tags as tag}
                                                  <option>{tag}</option>
                                             {/each}
                                        </select>
                                   </div>
                              </div>
                              <div>
                                   <label for="description" class="block font-bold text-13 md:text-sm text-[#3A4374] dark:text-white">Feedback Detail</label>
                                   <span class="text-13 md:text-sm text-[#647196] dark:text-[#D1D7E9]">Include any specific comments on what should be improved, added, etc.</span>
                                   <div class="mt-3">
                                        <textarea type="text" bind:value={fields.description} rows="4" cols="50" name="description" id="description" class="block w-full bg-[#F7F8FE] dark:bg-[#151E2C] text-13 md:text-15 text-[#3A4374] dark:text-[#8C92B4] p-3 rounded-[0.3125rem] border-0 ring-1 placeholder:text-[#3A4374] ring-inset ring-transparent focus:ring-2 focus:ring-inset focus:ring-indigo-600" style="resize: none;" required></textarea>
                                   </div>
                              </div>
                         </div>
                    </div>
                    <div class="flex flex-col md:flex-row md:justify-end items-center md:space-x-4 space-y-4 md:space-y-0 mt-8">
                         <button on:click={()=>{showCreateForm = false}} type="button" class="mt-3 inline-flex w-full justify-center items-center rounded-[0.625rem] bg-[#10263E] hover:bg-[#656EA3] dark:bg-black px-3 h-10 md:w-[5.8125rem] text-[#F2F4FE] ring-1 ring-inset ring-gray-300 dark:ring-black sm:col-start-1 sm:mt-0">Cancel</button>
                         <button type="submit" class="inline-flex w-full justify-center items-center rounded-[0.625rem] bg-[#AD1FE9] hover:bg-[#C75AF6] px-3 h-10 md:w-[9rem] text-[#F2F4FE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2">Add feedback</button>
                    </div>
               </form>
          </div>
     </div>
{:else}
     <div class="bg-white dark:bg-[#0F172A] h-full" style="min-height: 100dvh;"></div>
{/if}