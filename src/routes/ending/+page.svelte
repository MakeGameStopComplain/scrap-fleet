<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    import image from "$lib/winScreen.png";
    import menuButton from "$lib/gui_assets/main_menu.png";
</script>

<div style:position="fixed"
    style:top="0" style:left="0"
    style:width="100vw"
    style:height="100vh"
    style:background-image="url('{image}')"
    style:background-size="cover"
    style:background-position="center"></div>
<input type="image"
    src={menuButton}
    style:position="fixed"
    style:top="10px"
    style:right="10px"
    style:width="140px"
    on:click={() => {
        goto("../");
    }} alt="MAIN MENU" />

<style>
    input[type=image] {
        transition: transform 0.2s;
    }

    input[type=image]:hover {
        transform: scale(1.1);
    }
</style>