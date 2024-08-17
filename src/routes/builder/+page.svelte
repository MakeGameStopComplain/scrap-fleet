<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import Ship from "$lib/Ship.svelte";
    
    let shipStr = ".......\n" +
    "..###..\n" +
    "...#...\n" +
    "..###..\n" +
    "...#...\n" +
    "..###..\n" +
    ".......";

    function saveButton() {
        localStorage.setItem("shipStr", shipStr);
        goto("/");
    }

    onMount(() => {
        if (localStorage.getItem("shipStr")) {
            shipStr = localStorage.getItem("shipStr");
        }
    });
</script>

<textarea rows={7} cols={7} bind:value={shipStr}></textarea>
<br />
<button on:click={saveButton}>Return to le main menu</button>

<style>
    :global(body) {
        margin: none;
    }

    textarea {
        resize: none;
        overflow: hidden;
    }
</style>