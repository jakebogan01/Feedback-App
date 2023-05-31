<script>
     import Authentication from '../components/Authentication.svelte';
     import { onMount } from 'svelte';
     import { preferences } from '../store/preferences';
     import { goto } from '$app/navigation';
     export let data;

     onMount(() => {
          if ($preferences[1]?.email.length > 1) {
               goto('/suggestions');
          }
     })
</script>

<Authentication data={data} />