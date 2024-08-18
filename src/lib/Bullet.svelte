<script context="module">
    let current;
</script>

<script>
    import { onMount } from "svelte";
    import redBullet from "$lib/ship_assets/laser_bullet.png";
    import blueBullet from "$lib/ship_assets/bulletBlue.png";

    //let radius = 5;

    export let xPos = 200;
    export let yPos = 200;
    export let angle = 0;

    let bulletSprite = redBullet;
    export let blue = false;

    onMount(() => {
        if (blue) bulletSprite = blueBullet;
    });
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