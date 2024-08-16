<script>
    import { onMount } from "svelte";
    import Ship from "$lib/Ship.svelte";
    
    let world;

    let inputs = {};

    let playerPos = {
        x: 200, y: 200,
    };

    function tick() {
        if (inputs["ArrowUp"]) playerPos.y -= 10;
        else if (inputs["ArrowDown"]) playerPos.y += 10;
        if (inputs["ArrowRight"]) playerPos.x += 10;
        else if (inputs["ArrowLeft"]) playerPos.x -= 10;

        requestAnimationFrame(tick);
    }

    onMount(() => {
        window.addEventListener("keydown", (e) => {
            inputs[e.key] = true;
        });
        window.addEventListener("keyup", (e) => {
            inputs[e.key] = false;
        });
        tick();
    });
</script>

<div bind:this={world}>
    <Ship xPos={playerPos.x} yPos={playerPos.y} angle={50} />
</div>

<style>
    :global(body) {
        margin: none;
    }
</style>