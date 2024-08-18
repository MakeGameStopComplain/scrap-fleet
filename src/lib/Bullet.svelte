<script context="module">
    let current;
</script>

<script>
    import { onMount } from "svelte";
    import bulletSprite from "$lib/ship_assets/laser_bullet.png";

    //let radius = 5;

    export let xPos = 200;
    export let yPos = 200;
    export let angle = 0;
</script>

<div style:position="absolute"
    style:top="{yPos}px"
    style:left="{xPos}px"
    style:width="{20}px"
    style:height="{10}px"
    style:transform="translate(-50%, -50%) rotate({90 + angle}deg)"
    style:background-image="url('{bulletSprite}')"
    style:background-size="100% 100%">
</div>

<style>
</style>