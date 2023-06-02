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

<div class="flex flex-col md:flex-row bg-white dark:bg-[#1E283A] p-6 md:py-7 md:px-8 rounded-[0.625rem] text-13 group {currentStatus !== "" ? borderStyles : ""}" data-sveltekit-preload-data="hover">
     <div class="hidden md:block pr-10">
          <form on:submit|preventDefault|once>
               <button type="submit" class="flex flex-row md:flex-col items-center md:justify-center space-x-2 md:space-x-0 bg-[#F2F4FF] hover:bg-[#CED7FF] dark:bg-[#17202F] dark:hover:bg-[#3A4374] dark:hover:text-white rounded-[0.625rem] px-4 py-1 md:p-0 md:w-10 md:h-[3.3125rem] font-bold text-[#3A4374] dark:text-white">
                    <img src="/shared/icon-arrow-up.svg" alt="" role="presentation">
                    <span class="mt-1">{suggestion?.likes}</span>
               </button>
          </form>
     </div>
     <a href="/suggestions/{suggestion?._id}" class="block flex-1 md:pr-[1.5625rem]">
          <div class="flex items-center {currentStatus !== "" ? "mb-4" : ""}">
               {#if currentStatus !== ""}
                    <div class="w-2 h-2 {circleStyles} rounded-full mr-2"></div>
               {/if}
               <span class="text-[#647196]">{currentStatus}</span>
          </div>
          <h2 class="font-bold text-[#3A4374] group-hover:text-[#4761E6] dark:text-white md:text-lg leading-3">{suggestion?.title}</h2>
          <p class="text-[#647196] dark:text-[#D1D7E9] md:text-base my-2 md:mb-4">{suggestion?.description}</p>
          <span class="hidden md:inline-block bg-[#F2F4FF] dark:bg-[#17202F] rounded-[0.625rem] px-4 py-1 font-semibold text-[#4661E6]">{suggestion?.tag}</span>
     </a>
     <div class="flex items-end md:items-center justify-between">
          <div class="md:hidden space-y-4">
               <span class="block bg-[#F2F4FF] dark:bg-[#17202F] rounded-[0.625rem] px-4 py-1 font-semibold text-[#4661E6]">{suggestion?.tag}</span>
               <form on:submit|preventDefault|once>
                    <button type="submit" class="flex items-center space-x-2 bg-[#F2F4FF] hover:bg-[#CED7FF] dark:bg-[#17202F] dark:hover:bg-[#3A4374] dark:hover:text-white rounded-[0.625rem] px-4 py-1 font-bold text-[#3A4374] dark:text-white">
                         <img src="/shared/icon-arrow-up.svg" alt="" role="presentation">
                         <span>{suggestion?.likes}</span>
                    </button>
               </form>
          </div>
          <a href="/suggestions/{suggestion?._id}" class="flex items-center space-x-2 font-bold text-[#3A4374] md:text-base">
               <svg width="18" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M2.62 16H1.346l.902-.91c.486-.491.79-1.13.872-1.823C1.036 11.887 0 9.89 0 7.794 0 3.928 3.52 0 9.03 0 14.87 0 18 3.615 18 7.455c0 3.866-3.164 7.478-8.97 7.478-1.017 0-2.078-.137-3.025-.388A4.705 4.705 0 012.62 16z" fill="#CDD2EE" fill-rule="nonzero"/></svg>
               <span class="dark:text-[#D1D7E9]">{suggestion?.comment.length}</span>
          </a>
     </div>
</div>