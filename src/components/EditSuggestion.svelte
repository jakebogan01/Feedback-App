<script>
     import { onMount } from 'svelte';
     export let showEditForm;

     let suggestions;
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

<div class="relative" style="z-index: 100;" aria-labelledby="modal-title" role="dialog" aria-modal="true">
     <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
     <div class="fixed inset-0 z-10 overflow-y-auto" on:keydown={()=>{}} on:click|self={()=>{showEditForm = false}}>
          <div class="flex min-h-full justify-center text-center items-center p-0" on:keydown={()=>{}} on:click|self={()=>{showEditForm = false}}>
               <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-[#2B2C37] px-4 pb-4 pt-5 text-left shadow-xl transition-all my-8 w-full max-w-[30rem] p-6">
                    <form method="POST" action="?/createSuggestion" enctype="multipart/form-data">
                         <div>
                              <div class="mt-3">
                                   <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white text-center" id="modal-title">Add New Board</h3>
                                   <div class="mt-2">
                                        {#if suggestions}
                                             <div>
                                                  <label for="title" class="block text-xs font-bold leading-6 text-[#828FA3] dark:text-white">Name</label>
                                                  <div class="mt-2">
                                                       <input type="text" bind:value={fields.title} name="title" id="title" class="block w-full bg-transparent dark:bg-[#2B2C37] dark:text-wite rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-[#3E3F4E] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="e.g. Web Design" required>
                                                  </div>
                                             </div>
                                             <div>
                                                  <label for="tag" class="block text-sm font-medium leading-6 text-gray-900">tags</label>
                                                  <select id="tag" bind:value={fields.tag} name="tag" class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                       <option></option>
                                                       {#each suggestions as suggestion}
                                                            <option>{suggestion?.tag}</option>
                                                       {/each}
                                                  </select>
                                             </div>
                                             <div>
                                                  <label for="description" class="block text-xs font-bold leading-6 text-[#828FA3] dark:text-white">description</label>
                                                  <div class="mt-2">
                                                       <input type="text" bind:value={fields.description} name="description" id="description" class="block w-full bg-transparent dark:bg-[#2B2C37] dark:text-wite rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-[#3E3F4E] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="e.g. Web Design" required>
                                                  </div>
                                             </div>
                                        {/if}
                                   </div>
                              </div>
                         </div>
                         <div class="mt-5 sm:mt-4 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                              <button type="submit" class="inline-flex w-full justify-center items-center rounded-md bg-[#635FC7] px-3 h-10 text-sm font-semibold text-white shadow-sm hover:bg-[#A8A4FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2">Add feedback</button>
                              <button on:click={()=>{showEditForm = false}} type="button" class="mt-3 inline-flex w-full justify-center items-center rounded-md bg-[#EA5555] px-3 h-10 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-[#FF9898] sm:col-start-1 sm:mt-0">Cancel</button>
                         </div>
                    </form>
               </div>
          </div>
     </div>
</div>