<script>
     export let suggestion;
     export let currentStatus = '';
     let borderStyles = '';
     let circleStyles = '';

     $: {
          if (currentStatus === "Pending") {
               borderStyles = 'border-t-[0.375rem] border-[#F49F85]';
               circleStyles = 'bg-[#F49F85]';
          } else if (currentStatus === "In-Progress") {
               borderStyles = 'border-t-[0.375rem] border-[#AD1FE9]';
               circleStyles = 'bg-[#AD1FE9]';
          } else if (currentStatus === "Live") {
               borderStyles = 'border-t-[0.375rem] border-[#63BCFB]';
               circleStyles = 'bg-[#63BCFB]';
          }
     }
</script>

<div class="bg-white p-6 rounded-[0.625rem] text-13 {currentStatus !== "" ? borderStyles : ""}" data-sveltekit-preload-data="hover">
     <a href="/suggestions/{suggestion?._id}" class="block">
          <div class="flex items-center {currentStatus !== "" ? "mb-4" : ""}">
               {#if currentStatus !== ""}
                    <div class="w-2 h-2 {circleStyles} rounded-full mr-2"></div>
               {/if}
               <span class="text-[#647196]">{currentStatus}</span>
          </div>
          <h2 class="font-bold text-[#3A4374] leading-3">{suggestion?.title}</h2>
          <p class="text-[#647196] my-2">{suggestion?.description}</p>
     </a>
     <div class="flex items-end justify-between">
          <div class="space-y-4">
               <span class="block bg-[#F2F4FF] rounded-[0.625rem] px-4 py-1 font-semibold text-[#4661E6]">{suggestion?.tag}</span>
               <form on:submit|preventDefault|once>
                    <button type="submit" class="flex items-center space-x-2 bg-[#F2F4FF] rounded-[0.625rem] px-4 py-1 font-bold text-[#3A4374]">
                         <img src="/shared/icon-arrow-up.svg" alt="" role="presentation">
                         <span>{suggestion?.likes}</span>
                    </button>
               </form>
          </div>
          <a href="/suggestions/{suggestion?._id}" class="flex items-center space-x-2 font-bold text-[#3A4374]">
               <svg width="18" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M2.62 16H1.346l.902-.91c.486-.491.79-1.13.872-1.823C1.036 11.887 0 9.89 0 7.794 0 3.928 3.52 0 9.03 0 14.87 0 18 3.615 18 7.455c0 3.866-3.164 7.478-8.97 7.478-1.017 0-2.078-.137-3.025-.388A4.705 4.705 0 012.62 16z" fill="#CDD2EE" fill-rule="nonzero"/></svg>
               <span>{suggestion?.comment.length}</span>
          </a>
     </div>
</div>