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

<div class="fixed inset-0 bg-[#F7F8FE] w-full px-6 pt-8 pb-[4.8125rem] z-50 overflow-y-auto min-h-screen" style="z-index: 100;" aria-labelledby="modal-title" role="dialog" aria-modal="true">
     <BackLink bind:showCreateForm={showCreateForm} />
     <form method="POST" action="?/createSuggestion" enctype="multipart/form-data" class="relative bg-white p-6 rounded-[0.625rem] mt-12">
          <img src="/shared/icon-new-feedback.svg" alt="" role="presentation" class="absolute -top-5 h-10">
          <div class="mt-6">
               <h3 class="font-bold text-lg text-[#3A4374]" id="modal-title">Create New Feedback</h3>
               <div class="mt-6 space-y-6">
                    {#if suggestions}
                         <div>
                              <label for="title" class="block font-bold text-13 text-[#3A4374]">Feedback Title</label>
                              <span class="text-13 text-[#647196]">Add a short, descriptive headline</span>
                              <div class="mt-3">
                                   <input type="text" bind:value={fields.title} name="title" id="title" class="block w-full bg-[#F7F8FE] text-13 text-[#3A4374] p-3 rounded-[0.3125rem] border-0 ring-1 ring-inset ring-transparent focus:ring-2 focus:ring-inset focus:ring-indigo-600" required>
                              </div>
                         </div>
                         <div>
                              <label for="tag" class="block font-bold text-13 text-[#3A4374]">Category</label>
                              <span class="text-13 text-[#647196]">Choose a category for your feedback</span>
                              <div class="mt-3">
                                   <select id="tag" bind:value={fields.tag} name="tag" class="block w-full bg-[#F7F8FE] text-13 text-[#3A4374] p-3 rounded-[0.3125rem] border-0 ring-1 ring-inset ring-transparent focus:ring-2 focus:ring-inset focus:ring-indigo-600">
                                        <option></option>
                                        {#each tags as tag}
                                             <option>{tag}</option>
                                        {/each}
                                   </select>
                              </div>
                         </div>
                         <div>
                              <label for="description" class="block font-bold text-13 text-[#3A4374]">Feedback Detail</label>
                              <span class="text-13 text-[#647196]">Include any specific comments on what should be improved, added, etc.</span>
                              <div class="mt-3">
                                   <textarea type="text" bind:value={fields.description} rows="4" cols="50" name="description" id="description" class="block w-full bg-[#F7F8FE] text-13 text-[#3A4374] p-3 rounded-[0.3125rem] border-0 ring-1 ring-inset ring-transparent focus:ring-2 focus:ring-inset focus:ring-indigo-600" style="resize: none;" required></textarea>
                              </div>
                         </div>
                    {/if}
               </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
               <button type="submit" class="inline-flex w-full justify-center items-center rounded-[0.625rem] bg-[#AD1FE9] px-3 h-10 text-[#F2F4FE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2">Add feedback</button>
               <button on:click={()=>{showCreateForm = false}} type="button" class="mt-3 inline-flex w-full justify-center items-center rounded-[0.625rem] bg-[#10263E] px-3 h-10 text-[#F2F4FE] ring-1 ring-inset ring-gray-300 hover:bg-[#FF9898] sm:col-start-1 sm:mt-0">Cancel</button>
          </div>
     </form>
</div>