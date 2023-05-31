<script>
     export let data = null;

     let filterByNumbers = '';
     let tagFilter = false;
     let filterByTag = '';
     let filterByStatus = 'status';
     let suggestions = data?.suggestions?.data;

     const removeDuplicates = (ar) => {
          let filterArray = [...ar];
          let unique = [...new Set(filterArray)];
          return unique.filter(e => e);
     }

     $: tags = suggestions.map((item) => {
          if (item.status == filterByStatus) {
               return item.tag;
          }
     })

     let statuses = suggestions.map((item) => {
          return item.status;
     })

     let copiedSuggestions = [];
     $: {
          copiedSuggestions = [...suggestions];
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
     }
</script>

<div>
     <label for="filter" class="block text-sm font-medium leading-6 text-gray-900">Filter by:</label>
     <select bind:value={filterByNumbers} id="filter" name="filter" class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <option></option>
          <option>Most Upvotes</option>
          <option>Least Upvotes</option>
          <option>Most Comments</option>
          <option>Least Comments</option>
     </select>
</div>

{#each copiedSuggestions as suggestion}
     {#if suggestion.status == filterByStatus}
          {#if suggestion.tag == filterByTag && tagFilter}
               <div class="py-4 px-4">
                    <p>{suggestion?.title}</p>
                    <p>{suggestion?.description}</p>
                    <p>{suggestion?.likes}</p>
                    <p>{suggestion?.tag}</p>
                    <p>{suggestion?.comment.length}</p>
               </div>
               <hr>
          {:else if !tagFilter}
               <div class="py-4 px-4">
                    <p>{suggestion?.title}</p>
                    <p>{suggestion?.description}</p>
                    <p>{suggestion?.likes}</p>
                    <p>{suggestion?.tag}</p>
                    <p>{suggestion?.comment.length}</p>
               </div>
               <hr>
          {/if}
     {/if}
{/each}

<div>
     <h2>Tags:</h2>
     <p on:keydown={()=>{}} on:click={()=>{tagFilter = false; filterByTag = ''; filterByNumbers = ''}}>All</p>
     {#each removeDuplicates(tags) as tag}
          <p on:keydown={()=>{}} on:click={()=>{tagFilter = true; filterByTag = tag; filterByNumbers = ''}}>{tag}</p>
     {/each}
</div>

<div class="pt-4">
     <h2>statuses:</h2>
     {#each removeDuplicates(statuses) as status}
          <p on:keydown={()=>{}} on:click={()=>{filterByStatus = status}}>{status}</p>
     {/each}
</div>