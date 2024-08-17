<script context="module">
    let current;
</script>

<script>
    import { onMount } from "svelte";

    let radius = 5;

    export let xPos = 200;
    export let yPos = 200;
    export let angle = 0;
</script>

<div style:position="absolute"
    style:top="{yPos}px"
    style:left="{xPos}px"
    style:width="{radius * 2}px"
    style:height="{radius * 2}px"
    style:transform="translate(-50%, -50%) rotate({angle}deg)"
    style:background-color="blue">
</div>

<style>
</style>