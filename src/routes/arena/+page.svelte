<script>
    import { onMount } from "svelte";
    import Ship from "$lib/Ship.svelte";
    import Bullet from "$lib/Bullet.svelte";
    import { goto } from "$app/navigation";
    import backdrop1 from "$lib/backgrounds/background1.png";
    import themeSong from "$lib/audio/spaceship_main_theme.wav";
    import Enemy from "$lib/Enemy.svelte";
    import resignButton from "$lib/gui_assets/concede.png";
    import menuButton from "$lib/gui_assets/main_menu.png";
    
    let world;

    let inputs = {};

    let playerPos = {
        x: 600, y: 500, angle: 0,
    };

    let playerBullets = [];
    let enemyBullets = [];

    let playerShipComponent;
    
    let enemies = [
        {
            type: "scout",
            component: null,
        }
    ];

    let frame = 0;
    function tick() {
        frame++;

        if (inputs["ArrowUp"]) playerShipComponent.thrusting = 1;
        else if (inputs["ArrowDown"]) playerShipComponent.thrusting = -1;
        else playerShipComponent.thrusting = 0;

        if (inputs["ArrowRight"]) playerShipComponent.rotate(5);
        else if (inputs["ArrowLeft"]) playerShipComponent.rotate(-5);
        playerShipComponent.tick();

        setCamera(playerPos.x, playerPos.y);

        if (inputs["x"]) {
            let newBullets = playerShipComponent.createBullet();
            playerBullets = [...playerBullets, ...newBullets];
            inputs["x"] = false;
        }

        let i = 0;
        while (i < playerBullets.length) {
            let bull = playerBullets[i];
            bull.y -= Math.cos(bull.angle * Math.PI / 180) * bull.speed;
            bull.x += Math.sin(bull.angle * Math.PI / 180) * bull.speed;
            if (bull.x <= 0 || bull.y <= 0 || bull.x >= arenaWidth || bull.y >= arenaHeight) {
                playerBullets.splice(i, 1);
                i--;
            }
            i++;
        }
        playerBullets = playerBullets;
        
        if (playerPos.x < 0) playerPos.x = 0;
        if (playerPos.y < 0) playerPos.y = 0;
        if (playerPos.x > arenaWidth) playerPos.x = arenaWidth;
        if (playerPos.y > arenaHeight) playerPos.y = arenaHeight;

        for (let baddy of enemies) {
            baddy.component.tick();
            for (let bull of playerBullets) {
                baddy.component.checkBullet(bull);
            }
            if (frame % 100 == 0) {
                enemyBullets = [...enemyBullets, ...baddy.component.createBullet()];
            }
        }

        i = 0;
        while (i < enemyBullets.length) {
            let bull = enemyBullets[i];
            bull.y -= Math.cos(bull.angle * Math.PI / 180) * bull.speed;
            bull.x += Math.sin(bull.angle * Math.PI / 180) * bull.speed;
            if (bull.x <= 0 || bull.y <= 0 || bull.x >= arenaWidth || bull.y >= arenaHeight) {
                enemyBullets.splice(i, 1);
                i--;
            }
            i++;
        }
        enemyBullets = enemyBullets;

        i = 0;
        while (i < enemies.length) {
            if (!enemies[i].component.alive) enemies.splice(i, 1);
            else i++;
        }
        enemies = enemies;

        requestAnimationFrame(tick);
    }

    let playerShipBody = [];
    let shipStr = "";

    let levelOn;
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

        if (localStorage.getItem("levelOn")) {
            levelOn = parseFloat(localStorage.getItem("levelOn"));
        }

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
    style:width="{arenaWidth}px" style:height="{arenaHeight}px"
    style:background-image="url('{backdrop1}')" style:background-size="cover"
    style:background-position="center">
    <Ship bind:xPos={playerPos.x} bind:yPos={playerPos.y} body={playerShipBody} bind:this={playerShipComponent} />
    {#each playerBullets as bull}
        <Bullet xPos={bull.x} yPos={bull.y} angle={bull.angle} blue />
    {/each}
    {#each enemies as baddy}
        <Enemy type={baddy.type} bind:this={baddy.component} playerPos={playerPos} />
    {/each}
    {#each enemyBullets as bull}
        <Bullet xPos={bull.x} yPos={bull.y} angle={bull.angle} />
    {/each}
</div>

<input type="image"
    src={resignButton}
    style:position="fixed"
    style:top="10px"
    style:right="10px"
    style:width="140px"
    on:click={() => {
        goto("../builder");
    }} alt="CONCEDE" />
<input type="image"
    src={menuButton}
    style:position="fixed"
    style:top="10px"
    style:right="160px"
    style:width="140px"
    on:click={() => {
        goto("../");
    }} alt="MAIN MENU" />

<audio autoplay loop>
    <source src={themeSong} type="audio/wav" />
</audio>

<style>
    :global(body) {
        margin: 0;
    }

    #world {
        position: fixed;
    }

    input[type=image] {
        transition: transform 0.2s;
    }

    input[type=image]:hover {
        transform: scale(1.1);
    }
</style>