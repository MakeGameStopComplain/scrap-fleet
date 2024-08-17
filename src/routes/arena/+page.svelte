<script>
    import { onMount } from "svelte";
    import Ship from "$lib/Ship.svelte";
    import Bullet from "$lib/Bullet.svelte";
    import { goto } from "$app/navigation";
    
    let world;

    let inputs = {};

    let playerPos = {
        x: 200, y: 200, angle: 0,
    };
    let playerVelocity = 0;
    let accelerating = false;

    let playerBullets = [];
    let bulletSpeed = 24;

    function tick() {
        if (inputs["ArrowUp"]) {
            playerVelocity += 0.5;
            accelerating = true;
        }
        else if (inputs["ArrowDown"]) {
            playerVelocity -= 0.5;
            accelerating = true;
        }
        else accelerating = false;
        if (inputs["ArrowRight"]) playerPos.angle += 5;
        else if (inputs["ArrowLeft"]) playerPos.angle -= 5;
        playerVelocity = Math.max(Math.min(playerVelocity, 12), -12);
        if (!accelerating) playerVelocity /= 1.05;

        playerPos.y -= Math.cos(playerPos.angle * Math.PI / 180) * playerVelocity;
        playerPos.x += Math.sin(playerPos.angle * Math.PI / 180) * playerVelocity;

        setCamera(playerPos.x, playerPos.y);

        if (inputs["x"]) {
            playerBullets.push({
                x: playerPos.x,
                y: playerPos.y,
                angle: playerPos.angle,
            });
            playerBullets = playerBullets;
            inputs["x"] = false;
        }

        let i = 0;
        while (i < playerBullets.length) {
            let bull = playerBullets[i];
            bull.y -= Math.cos(bull.angle * Math.PI / 180) * bulletSpeed;
            bull.x += Math.sin(bull.angle * Math.PI / 180) * bulletSpeed;
            if (bull.x <= 0 || bull.y <= 0 || bull.x >= arenaWidth || bull.y >= arenaHeight) {
                playerBullets.splice(i, 1);
                i--;
            }
            i++;
        }
        playerBullets = playerBullets;


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

    let arenaWidth = 2000, arenaHeight = 2000;

    let cameraLeft = 0, cameraTop = 0;
    function setCamera(x, y) {
        let midScreen = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
        };
        cameraTop = midScreen.y - y;
        cameraLeft = midScreen.x - x;
        cameraTop = Math.min(cameraTop, 0);
        cameraLeft = Math.min(cameraLeft, 0);
        if (cameraTop + arenaHeight < window.innerHeight) cameraTop = window.innerHeight - arenaHeight;
        if (cameraLeft + arenaWidth < window.innerWidth) cameraLeft = window.innerWidth - arenaWidth;
    }
</script>

<div bind:this={world} id="world" style:top="{cameraTop}px" style:left="{cameraLeft}px"
    style:width="{arenaWidth}px" style:height="{arenaHeight}px">
    <Ship xPos={playerPos.x} yPos={playerPos.y} angle={playerPos.angle} body={playerShipBody} />
    {#each playerBullets as bull}
        <Bullet xPos={bull.x} yPos={bull.y} angle={bull.angle} />
    {/each}
</div>

<button style:position="fixed"
    style:top="10px"
    style:right="10px"
    on:click={() => {
        goto("/");
    }}>Menu</button>

<style>
    :global(body) {
        margin: 0;
    }

    #world {
        position: fixed;
    }
</style>