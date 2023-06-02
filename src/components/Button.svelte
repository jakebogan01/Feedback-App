<script>
     export let showForm;
     export let buttonStyles;
     export let buttonText;
</script>

<button type="button" on:click={()=>{showForm = true}} class="{buttonStyles} font-bold text-13 text-[#F2F4FE] md:text-sm whitespace-nowrap py-2.5 px-4 rounded-[0.625rem]">{buttonText}</button>