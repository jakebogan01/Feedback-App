<script>
     export let showCreateForm = false;
     export let link = '';
     export let linkStyles = 'text-[#647196]';
</script>

{#if link.length >= 1}
     <a href={link} class="flex items-center space-x-2">
          <img src="/shared/icon-arrow-left.svg" alt="" role="presentation">
          <span class="font-bold text-13 {linkStyles}">Go Back</span>
     </a>
{:else}
     <button type="button" on:click={()=>{showCreateForm = false}} class="flex items-center space-x-2">
          <img src="/shared/icon-arrow-left.svg" alt="" role="presentation">
          <span class="font-bold text-13 text-[#647196]">Go Back</span>
     </button>
{/if}