<script>
    import { goto } from "$app/navigation";
</script>

<button on:click={() => { goto("/arena"); }}>fight</button>
<button on:click={() => { goto("/builder"); }}>build</button>