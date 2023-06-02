<script>
     export let showDropList;
     export let openMenu;
</script>

<nav class="relative flex-1 md:max-w-[13.88125rem] flex items-center md:items-end justify-between bg-no-repeat bg-center bg-cover h-[11.125rem] 1440:max-h-[8.5625rem] 1440:min-w-[15.9375rem] md:rounded-[0.625rem] md:h-auo px-6 py-6 md:px-8 md:py-6 z-50" on:keydown={()=>{}} on:click|self={()=>{showDropList = false}}>
     <div class="mt-1 md:mt-0">
          <h1 class="font-bold text-15 md:text-xl text-white leading-none">Leadmarvels</h1>
          <span class="font-medium text-13 md:text-15 text-[#E1D5FC]">Feedback Board</span>
     </div>
     <div on:keydown={()=>{}} on:click class="md:hidden space-y-1">
          <div class="w-5 h-[0.1875rem] bg-white duration-300 ease-in-out {openMenu ? "rotate-45 translate-y-1.5" : ""}"></div>
          <div class="w-5 h-[0.1875rem] bg-white duration-300 ease-in-out {openMenu ? "opacity-0" : ""}"></div>
          <div class="w-5 h-[0.1875rem] bg-white duration-300 ease-in-out {openMenu ? "-rotate-45 -translate-y-2" : ""}"></div>
     </div>
</nav>

<style>
     nav {
          background-image: url('/suggestions/desktop/background-header.png');
     }
</style>