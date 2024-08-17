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

    let playerShipBody = [];
    let shipStr = "";

    onMount(() => {
        if (localStorage.getItem("shipStr")) {
            shipStr = localStorage.getItem("shipStr");
        }
        else {
            shipStr = ".......\n" +
            "..###..\n" +
            "...#...\n" +
            "..###..\n" +
            "...#...\n" +
            "..###..\n" +
            ".......";
        }
        playerShipBody = [];
        for (let r = 0; r < 7; r++) {
            let row = [];
            for (let c = 0; c < 7; c++) {
                row.push(shipStr.replaceAll("\n", "").charAt(r * 7 + c));
            }
            playerShipBody.push(row);
        }
        playerShipBody = playerShipBody;

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
    <Ship xPos={playerPos.x} yPos={playerPos.y} angle={50} body={playerShipBody} />
</div>

<style>
    :global(body) {
        margin: none;
    }
</style>