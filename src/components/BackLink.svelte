<script>
     export let showCreateForm = false;
     export let link = '';
     export let linkStyles = 'text-[#647196]';

     const goBack = () => {
          window.history.back();
     }
</script>

{#if link.length >= 1}
     <button type="button" on:click={goBack} class="flex items-center space-x-2">
          <img src="/shared/icon-arrow-left.svg" alt="" role="presentation">
          <span class="font-bold text-13 md:text-sm dark:hover:text-white {linkStyles}">Go Back</span>
     </button>
{:else}
     <button type="button" on:click={()=>{showCreateForm = false}} class="flex items-center space-x-2">
          <img src="/shared/icon-arrow-left.svg" alt="" role="presentation">
          <span class="font-bold text-13 md:text-sm text-[#647196] dark:hover:text-white">Go Back</span>
     </button>
{/if}