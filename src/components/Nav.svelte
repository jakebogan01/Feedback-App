<script>
     export let showDropList;
</script>

<nav class="flex items-center justify-between h-[4.5rem] px-6" style="background-image: linear-gradient(to bottom left, #E35C80, #B13CDB, #4696EF);" on:keydown={()=>{}} on:click|self={()=>{showDropList = false}}>
     <div>
          <h1 class="font-bold text-15 text-white">Leadmarvels</h1>
          <span class="font-medium text-13 text-[#E1D5FC]">Feedback Board</span>
     </div>
     <div class="space-y-1">
          <div class="w-5 h-[0.1875rem] bg-white"></div>
          <div class="w-5 h-[0.1875rem] bg-white"></div>
          <div class="w-5 h-[0.1875rem] bg-white"></div>
     </div>
</nav>