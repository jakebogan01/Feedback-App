<script>
     export let data = null;

     let suggestions = data?.suggestions?.data;

     let tags = suggestions.map((item) => {
          return item.tag;
     })

     let statuses = suggestions.map((item) => {
          return item.status;
     })
</script>

{#each suggestions as suggestion}
     <div class="py-4 px-4">
          <p>{suggestion?.title}</p>
          <p>{suggestion?.description}</p>
          <p>{suggestion?.likes}</p>
          <p>{suggestion?.tag}</p>
          <p>{suggestion?.comment.length}</p>
     </div>
     <hr>
{/each}

<div>
     <h2>Tags:</h2>
     {#each tags as tag}
          <p>{tag}</p>
     {/each}
</div>

<div class="pt-4">
     <h2>statuses:</h2>
     {#each statuses as Status}
          <p>{Status}</p>
     {/each}
</div>