<script>
     import { onMount } from 'svelte';
     import BackLink from './BackLink.svelte';
     export let showEditForm;
     export let post;

     let suggestions;
     let tags = ['Feature', 'UI', 'UX', 'Bug', 'Enhancement'];
     let statuses = ['Pending', 'In-Progress', 'Live'];
     $: fields = {title: '', tag: '', status: '', description: ''};

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

     const handleUpdateLikes = async () => {
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
</script>

{#if suggestions}
     <div class="fixed inset-0 bg-[#F7F8FE] w-full px-6 pt-8 pb-[4.8125rem] z-50 overflow-y-auto min-h-screen" style="z-index: 100;" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <BackLink bind:showCreateForm={showEditForm} />
          <form on:submit|preventDefault={handleUpdateLikes} class="relative bg-white p-6 rounded-[0.625rem] mt-12">
               <img src="/shared/icon-edit-feedback.svg" alt="" role="presentation" class="absolute -top-5 h-10">
               <div class="mt-6">
                    <h3 class="font-bold text-lg text-[#3A4374]" id="modal-title">Editing '{post.title}'</h3>
                    <div class="mt-6 space-y-6">
                         <div>
                              <label for="title" class="block font-bold text-13 text-[#3A4374]">Feedback Title</label>
                              <span class="text-13 text-[#647196]">Add a short, descriptive headline</span>
                              <div class="mt-3">
                                   <input type="text" on:input={(event)=>{handleValidation(event, 'title')}} value={post.title} name="title" id="title" class="block w-full bg-[#F7F8FE] text-13 text-[#3A4374] p-3 rounded-[0.3125rem] border-0 ring-1 ring-inset ring-transparent focus:ring-2 focus:ring-inset focus:ring-indigo-600" required>
                              </div>
                         </div>
                         <div>
                              <label for="tag" class="block font-bold text-13 text-[#3A4374]">Category</label>
                              <span class="text-13 text-[#647196]">Choose a category for your feedback</span>
                              <div class="mt-3">
                                   <select id="tag" on:input={(event)=>{handleValidation(event, 'tag')}} value={post.tag} name="tag" class="block w-full bg-[#F7F8FE] text-13 text-[#3A4374] p-3 rounded-[0.3125rem] border-0 ring-1 ring-inset ring-transparent focus:ring-2 focus:ring-inset focus:ring-indigo-600">
                                        {#each tags as tag}
                                             <option>{tag}</option>
                                        {/each}
                                   </select>
                              </div>
                         </div>
                         <div>
                              <label for="status" class="block font-bold text-13 text-[#3A4374]">Update Status</label>
                              <span class="text-13 text-[#647196]">Change feature state</span>
                              <div class="mt-3">
                                   <select id="status" on:input={(event)=>{handleValidation(event, 'status')}} value={post.status} name="status" class="block w-full bg-[#F7F8FE] text-13 text-[#3A4374] p-3 rounded-[0.3125rem] border-0 ring-1 ring-inset ring-transparent focus:ring-2 focus:ring-inset focus:ring-indigo-600">
                                        {#each statuses as status}
                                             <option>{status}</option>
                                        {/each}
                                   </select>
                              </div>
                         </div>
                         <div>
                              <label for="description" class="block font-bold text-13 text-[#3A4374]">Feedback Detail</label>
                              <span class="text-13 text-[#647196]">Include any specific comments on what should be improved, added, etc.</span>
                              <div class="mt-3">
                                   <textarea type="text" on:input={(event)=>{handleValidation(event, 'description')}} value={post.description} rows="4" cols="50" name="description" id="description" class="block w-full bg-[#F7F8FE] text-13 text-[#3A4374] p-3 rounded-[0.3125rem] border-0 ring-1 ring-inset ring-transparent focus:ring-2 focus:ring-inset focus:ring-indigo-600" style="resize: none;" required></textarea>
                              </div>
                         </div>
                    </div>
               </div>
               <div class="mt-10 sm:mt-4 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button type="submit" class="inline-flex w-full justify-center items-center rounded-[0.625rem] bg-[#AD1FE9] px-3 h-10 text-[#F2F4FE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2">Save Changes</button>
                    <button on:click={()=>{showEditForm = false}} type="button" class="mt-3 inline-flex w-full justify-center items-center rounded-[0.625rem] bg-[#10263E] px-3 h-10 text-[#F2F4FE] ring-1 ring-inset ring-gray-300 hover:bg-[#FF9898] sm:col-start-1 sm:mt-0">Cancel</button>
                    <button type="button" class="mt-3 inline-flex w-full justify-center items-center rounded-[0.625rem] bg-[#D73737] px-3 h-10 text-[#F2F4FE] ring-1 ring-inset ring-gray-300 sm:col-start-1 sm:mt-0">Delete</button>
               </div>
          </form>
     </div>
{/if}