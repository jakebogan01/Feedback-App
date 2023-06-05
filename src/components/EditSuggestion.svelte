<script>
     import { onMount } from 'svelte';
     import BackLink from './BackLink.svelte';
     export let showEditForm;
     export let post;

     let suggestions;
     let tags = ['Feature', 'UI', 'UX', 'Bug', 'Enhancement', 'Marketing', 'Sales'];
     let statuses = ['Pending', 'In-Progress', 'Live'];
     $: fields = {title: '', tag: '', status: '', description: ''};
     let errors = {title: '', tag: '', status: '', description: ''};
     let valid = false;

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

     const handleValidation = (e, field) => {
          switch (field) {
               case "title":
                    fields.title = e.target.value;
                    break;
               case "tag":
                    fields.tag = e.target.value.trim();
                    break;
               case "status":
                    fields.status = e.target.value.trim();
                    break;
               case "description":
                    fields.description = e.target.value.trim();
                    break;
          }
     }

     const handleUpdateSuggestion = async () => {
          try {
               const response = await fetch(`https://feedback-api-eight.vercel.app/suggestions/${post._id}`, {
                    method: "PUT",
                    headers: {
                         Accept: "application.json",
                         "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                         title: fields.title === "" ? post.title : fields.title,
                         tag: fields.tag === "" ? post.tag : fields.tag,
                         status: fields.status === "" ? post.status : fields.status,
                         description: fields.description === "" ? post.description : fields.description,
                    }),
               }).then((response) => {
                    if (response.ok) { 
                         location.reload();
                    }
               });
          } catch (error) {
               console.error(error.message);
          }
          return;
     }

     const handleDeleteSuggestion = async () => {
          try {
               const response = await fetch(`https://feedback-api-eight.vercel.app/suggestions/${post._id}`, {
                    method: "DELETE",
                    headers: {
                         Accept: "application.json",
                         "Content-Type": "application/json",
                    },
               }).then((response) => {
                    if (response.ok) { 
                         window.history.back();
                    }
               });
          } catch (error) {
               console.error(error.message);
          }
          return;
     }

     let titles;
     $: {
          if (suggestions) {
               titles = suggestions.map((el) => {
                    return el.title;
               })
          }
     }
</script>

{#if suggestions}
     <div class="fixed inset-0 bg-[#F7F8FE] dark:bg-[#0F172A] w-full px-6 pt-8 md:pt-14 pb-[4.8125rem] z-50 overflow-y-auto min-h-screen" style="z-index: 100;" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="max-w-[33.75rem] mx-auto">
               <BackLink bind:showCreateForm={showEditForm} />
               <form on:submit|preventDefault={handleUpdateSuggestion} class="relative bg-white dark:bg-[#1E293B] p-6 rounded-[0.625rem] mt-12 md:mt-16">
                    <img src="/shared/icon-edit-feedback.svg" alt="" role="presentation" class="absolute -top-5 md:-top-7 h-10 md:h-14">
                    <div class="mt-6 md:mt-8">
                         <h3 class="font-bold text-lg md:text-2xl text-[#3A4374] dark:text-[#4761E6]" id="modal-title">Editing '{post.title}'</h3>
                         <div class="mt-6 md:mt-16 space-y-6">
                              <div>
                                   <label for="title" class="block font-bold text-13 md:text-sm text-[#3A4374] dark:text-white">Feedback Title</label>
                                   <span class="text-13 md:text-sm text-[#647196] dark:text-[#D1D7E9]">Add a short, descriptive headline</span>
                                   <div class="mt-3">
                                        <input type="text" on:blur={(e)=>{
                                             if (e.target.value.trim() === '') {
                                                  valid = false;
                                                  errors.title = "Title cannot be empty";
                                             } else {
                                                  errors.title = "";
                                             }
                                         }} 
                                         on:keyup={(e)=>{
                                             if (titles.includes(e.target.value.trim()) && e.target.value.trim() !== post.title) {
                                                  valid = false;
                                                  errors.title = "Title already in use";
                                             } else {
                                                  valid = true;
                                                  errors.title = "";
                                             }
                                         }} on:input={(event)=>{handleValidation(event, 'title')}} value={post.title} name="title" id="title" spellcheck="true" class="block w-full bg-[#F7F8FE] dark:bg-[#151E2C] text-13 md:text-15 text-[#3A4374] dark:text-[#8C92B4] p-3 rounded-[0.3125rem] border-0 ring-1 placeholder:text-[#3A4374] dark:placeholder:text-[#8C92B4] ring-inset {errors.title !== "" ? "ring-red-500" : "ring-transparent"} focus:ring-2 focus:ring-inset focus:ring-indigo-600" required>
                                   </div>
                                   <p class="text-red-500 text-[0.9rem]">{errors.title}</p>
                              </div>
                              <div>
                                   <label for="tag" class="block font-bold text-13 md:text-sm text-[#3A4374] dark:text-white">Category</label>
                                   <span class="text-13 md:text-sm text-[#647196] dark:text-[#D1D7E9]">Choose a category for your feedback</span>
                                   <div class="mt-3">
                                        <select id="tag" on:input={(event)=>{handleValidation(event, 'tag')}} value={post.tag} name="tag" class="block w-full bg-[#F7F8FE] dark:bg-[#151E2C] text-13 md:text-15 text-[#3A4374] dark:text-[#8C92B4] p-3 rounded-[0.3125rem] border-0 ring-1 placeholder:text-[#3A4374] dark:placeholder:text-[#8C92B4] ring-inset ring-transparent focus:ring-2 focus:ring-inset focus:ring-indigo-600">
                                             {#each tags as tag}
                                                  <option>{tag}</option>
                                             {/each}
                                        </select>
                                   </div>
                              </div>
                              <div>
                                   <label for="status" class="block font-bold text-13 md:text-sm text-[#3A4374] dark:text-white">Update Status</label>
                                   <span class="text-13 md:text-sm text-[#647196] dark:text-[#D1D7E9]">Change feature state</span>
                                   <div class="mt-3">
                                        <select id="status" on:input={(event)=>{handleValidation(event, 'status')}} value={post.status} name="status" class="block w-full bg-[#F7F8FE] dark:bg-[#151E2C] text-13 md:text-15 text-[#3A4374] dark:text-[#8C92B4] p-3 rounded-[0.3125rem] border-0 ring-1 placeholder:text-[#3A4374] dark:placeholder:text-[#8C92B4] ring-inset ring-transparent focus:ring-2 focus:ring-inset focus:ring-indigo-600">
                                             {#each statuses as status}
                                                  <option>{status}</option>
                                             {/each}
                                        </select>
                                   </div>
                              </div>
                              <div>
                                   <label for="description" class="block font-bold text-13 md:text-sm text-[#3A4374] dark:text-white">Feedback Detail</label>
                                   <span class="text-13 md:text-sm text-[#647196] dark:text-[#D1D7E9]">Include any specific comments on what should be improved, added, etc.</span>
                                   <div class="mt-3">
                                        <textarea type="text" on:blur={(e)=>{
                                             if (e.target.value.trim() === '') {
                                                  valid = false;
                                                  errors.description = "Description cannot be empty";
                                             } else {
                                                  errors.description = "";
                                             }
                                        }} on:input={(event)=>{handleValidation(event, 'description')}} spellcheck="true" value={post.description} rows="4" cols="50" name="description" id="description" class="block w-full bg-[#F7F8FE] dark:bg-[#151E2C] text-13 md:text-15 text-[#3A4374] dark:text-[#8C92B4] p-3 rounded-[0.3125rem] border-0 ring-1 placeholder:text-[#3A4374] dark:placeholder:text-[#8C92B4] ring-inset {errors.description !== "" ? "ring-red-500" : "ring-transparent"} focus:ring-2 focus:ring-inset focus:ring-indigo-600" style="resize: none;" required></textarea>
                                   </div>
                                   <p class="text-red-500 text-[0.9rem]">{errors.description}</p>
                              </div>
                         </div>
                    </div>
                    <div class="flex flex-col md:flex-row md:justify-between space-y-4 md:space-y-0 mt-8">
                         <button on:click={handleDeleteSuggestion} type="button" class="mt-3 inline-flex w-full justify-center items-center rounded-[0.625rem] bg-[#D73737] hover:bg-[#DB8285] px-3 h-10 md:w-[5.8125rem] text-[#F2F4FE] ring-1 ring-inset ring-gray-300 dark:ring-[#D73737] sm:mt-0">Delete</button>
                         <div class="flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0">
                              <button on:click={()=>{showEditForm = false}} type="button" class="inline-flex w-full justify-center items-center rounded-[0.625rem] bg-[#10263E] dark:bg-black px-3 h-10 md:w-[5.8125rem] text-[#F2F4FE] ring-1 ring-inset ring-gray-300 dark:ring-black hover:bg-[#656EA3] sm:mt-0">Cancel</button>
                              <button type="submit" class="inline-flex w-full justify-center items-center rounded-[0.625rem] bg-[#AD1FE9] hover:bg-[#C75AF6] px-3 h-10 md:w-[9rem] text-[#F2F4FE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save Changes</button>
                         </div>
                    </div>
               </form>
          </div>
     </div>
{:else}
     <div class="bg-white dark:bg-[#0F172A] h-full" style="min-height: 100dvh;"></div>
{/if}