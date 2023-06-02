<script>
     export let statuses;
     export let filterByStatus;
     export let count;
</script>

<div class="bg-white p-6 md:h-[11.125rem] rounded-[0.625rem]">
     <div class="flex items-center justify-between">
          <h4 class="font-bold text-lg text-[#3A4374]">Roadmap</h4>
          <a href="/roadmap" class="font-semibold text-13 text-[#4661E6]">View</a>
     </div>
     <div class="mt-4">
          {#each statuses as status, i}
               <div class="flex items-center justify-between">
                    <div class="flex items-center">
                         {#if status === "Pending"}
                              <div class="w-2 h-2 bg-[#F49F85] rounded-full mr-2"></div>
                         {:else if status === "In-Progress"}
                              <div class="w-2 h-2 bg-[#AD1FE9] rounded-full mr-2"></div>
                         {:else if status === "Live"}
                              <div class="w-2 h-2 bg-[#63BCFB] rounded-full mr-2"></div>
                         {/if}
                         <span on:keydown={()=>{}} on:click={()=>{filterByStatus = status}} class="text-base text-[#647196]">{status}</span>
                    </div>
                    <span class="font-bold text-base text-[#647196]">{count[i]}</span>
               </div>
          {/each}
     </div>
</div>