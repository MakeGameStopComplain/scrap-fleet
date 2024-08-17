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

        setCamera(playerPos.x, playerPos.y);

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

    let cameraLeft = 0, cameraTop = 0;
    function setCamera(x, y) {
        let midScreen = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
        };
        cameraTop = midScreen.y - y;
        cameraLeft = midScreen.x - x;
        if (cameraTop + 2000 < window.innerHeight) cameraTop = window.innerHeight - 2000;
        if (cameraLeft + 2000 < window.innerWidth) cameraLeft = window.innerWidth - 2000;
    }
</script>

<div bind:this={world} id="world" style:top="{cameraTop}px" style:left="{cameraLeft}px">
    <Ship xPos={playerPos.x} yPos={playerPos.y} angle={50} body={playerShipBody} />
</div>

<style>
    :global(body) {
        margin: none;
    }

    #world {
        position: fixed;
        width: 2000px;
        height: 2000px;
    }
</style>