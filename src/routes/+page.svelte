<script>
     import Authentication from '../components/Authentication.svelte';
     import { onMount, afterUpdate } from 'svelte';
     import { preferences } from '../store/preferences';
     import { goto } from '$app/navigation';
     export let data;

     onMount(() => {
          if ($preferences[1]?.email.length > 1) {
               goto('/suggestions');
          }
          // preferences.update(currentPreferences => {
          //      let currentUser = allUsers.filter((item) => {
          //           if (item.email === $preferences[0].email) {
          //                return item;
          //           }
          //      });

          //      if (currentUser.length < 1) {
          //           return [...currentPreferences];
          //      } else {
          //           const uniqueValues = new Set(currentPreferences.map(v => v.name));
     
          //           if (uniqueValues.size < currentPreferences.length) {
          //                userExists = true;
          //                return [...currentPreferences];
          //           } else {
          //                userExists = true;
          //                return [...currentPreferences, currentUser[0]];
          //           }
          //      }
          // });

          // if (userExists) {
          //      goto('/dashboard');
          // }
     })

</script>

<Authentication data={data} />