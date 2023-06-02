<script>
     export let tagFilter;
     export let filterByTag;
     export let filterByNumbers;
     export let tags;
</script>

<div class="bg-white p-6 md:h-[11.125rem] rounded-[0.625rem]">
     <div class="flex flex-wrap justify-evenly gap-x-2 gap-y-3.5">
          <span on:keydown={()=>{}} on:click={()=>{tagFilter = false; filterByTag = ''; filterByNumbers = ''}} class="block bg-[#F2F4FF] rounded-[0.625rem] px-4 py-1 font-semibold text-[#4661E6]">All</span>
          {#each tags as tag}
               <span on:keydown={()=>{}} on:click={()=>{tagFilter = true; filterByTag = tag; filterByNumbers = ''}} class="block bg-[#F2F4FF] rounded-[0.625rem] px-4 py-1 font-semibold text-[#4661E6]">{tag}</span>
          {/each}
     </div>
</div>