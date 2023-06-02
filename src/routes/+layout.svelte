<script>
     import { preferences } from '../store/preferences';
     import "../app.css";

     let themeMode;
     $: {
          themeMode = $preferences[0].theme;
     }
</script>

<div class="font-jost font-normal {themeMode}">
     <div class="bg-[#0F172A]">
          <slot />
     </div>
</div>