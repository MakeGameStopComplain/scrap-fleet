<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    onMount(() => {
        setTimeout(() => {
            goto("../builder");
        }, 2222);
    });

    import image from "$lib/loadingScreen.png";
</script>

<div style:position="fixed"
    style:top="0" style:left="0"
    style:width="100vw"
    style:height="100vh"
    style:background-image="url('{image}')"
    style:background-size="cover"
    style:background-position="center"></div>

<style>
</style>