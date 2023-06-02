<script>
     export let tagFilter;
     export let filterByTag;
     export let filterByNumbers;
     export let tags;
</script>

<div class="bg-white p-6 md:h-[11.125rem] 1440:h-auto 1440:min-w-[15.9375rem] 1440:max-w-[15.9375rem] rounded-[0.625rem]">
     {#if tags.length == 0}
          <div class="flex items-center justify-center h-full font-semibold text-gray-300 text-lg">
               <span>No Suggestions</span>
          </div>
     {:else}
          <div class="flex flex-wrap {tags.length > 1 ? "justify-evenly" : "justify-start"} gap-x-2 gap-y-3.5 text-13">
               {#if tags.length > 1}
                    <span on:keydown={()=>{}} on:click={()=>{tagFilter = false; filterByTag = ''; filterByNumbers = ''}} class="block bg-[#F2F4FF] rounded-[0.625rem] px-4 py-1 font-semibold text-[#4661E6] cursor-pointer">All</span>
               {/if}
               {#each tags as tag}
                    <span on:keydown={()=>{}} on:click={()=>{tagFilter = true; filterByTag = tag; filterByNumbers = ''}} class="block bg-[#F2F4FF] rounded-[0.625rem] px-4 py-1 font-semibold text-[#4661E6] cursor-pointer">{tag}</span>
               {/each}
          </div>
     {/if}
</div>