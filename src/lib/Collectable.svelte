<script context="module">
    let current;
</script>
<svelte:options accessors={true} />

<script>
    import { onMount } from "svelte";
    import blockSprite from "$lib/ship_assets/block.png";
    import gunSprite from "$lib/ship_assets/laser_gun.png";
    import reactorSprite from "$lib/ship_assets/reactor.png";
    import thrusterSprite from "$lib/ship_assets/thruster.png";

    //let radius = 5;

    export let xPos = 200;
    export let yPos = 200;
    export let angle = 0;
    export let type = "B";

    let fillMap = {
        "B": `url("${blockSprite}")`,
        "G": `url("${gunSprite}")`,
        "R": `url("${reactorSprite}")`,
        "T": `url("${thrusterSprite}")`,
    };

    export function tick() {
        angle += 0.5
    }
</script>

<div style:position="absolute"
    style:top="{yPos}px"
    style:left="{xPos}px"
    style:width="{25}px"
    style:height="{25}px"
    style:transform="translate(-50%, -50%) rotate({angle}deg)"
    style:background-image={fillMap[type]}
    style:background-size="100% 100%">
</div>

<style>
</style>