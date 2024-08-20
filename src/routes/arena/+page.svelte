<script>
    import { onMount } from "svelte";
    import Ship from "$lib/Ship.svelte";
    import Bullet from "$lib/Bullet.svelte";
    import { goto } from "$app/navigation";
    import backdrop1 from "$lib/backgrounds/background1.png";
    import backdrop2 from "$lib/backgrounds/background2.png";
    import backdrop3 from "$lib/backgrounds/background3.png";
    import themeSong from "$lib/audio/spaceship_main_theme.wav";
    import Enemy from "$lib/Enemy.svelte";
    import resignButton from "$lib/gui_assets/concede.png";
    import menuButton from "$lib/gui_assets/main_menu.png";
    import proceedButton from "$lib/gui_assets/proceed.png";
    import Collectable from "$lib/Collectable.svelte";
    import thrustSound from "$lib/audio/fixed_thruster_sound.wav";
    import "$lib/copperplate/font.css";
    import levelCompleteSign from "$lib/gui_assets/levelComplete.png";
    import pickupSound from "$lib/audio/pickup_sound.wav";
    import blockHitSound from "$lib/audio/building_sounnd.wav";
    
    let world;

    let inputs = {};

    let playerPos = {
        x: 1000, y: 1000, angle: 0,
    };

    let playerBullets = [];
    let enemyBullets = [];
    let collectables = [];

    let playerShipComponent;
    
    let enemies = [
        {
            type: "fighter",
            component: null,
            x: 100, y: 100,
            alive: true,
        },
        {
            type: "scout",
            component: null,
            x: 1900, y: 1900,
            alive: true,
        },
        {
            type: "scout",
            component: null,
            x: 1900, y: 100,
            alive: true,
        },
        {
            type: "carrier",
            component: null,
            x: 100, y: 1900,
            alive: true,
        },
    ];

    function exitStage(success=false) {
        if (success && levelOn == 3) {
            goto("../ending");
        }
        else if (success) {
            localStorage.setItem("inventory", JSON.stringify(inventory));
            localStorage.setItem("levelOn", levelOn + 1);
            let rows = [];
            for (let row of playerShipBody) {
                let rowStr = "";
                for (let cell of row) {
                    rowStr += cell.toUpperCase();
                }
                rows.push(rowStr);
            }
            let shipFinal = rows.join("\n");
            localStorage.setItem("shipStr", shipFinal);
            goto("../loading");
        }
        else {
            goto("../builder");
        }
    }

    function getRandomItemType() {
        let rng = Math.random();
        let itemType = "B";
        if (rng < 0.6) itemType = "B";
        else if (rng < 0.7) itemType = "G";
        else if (rng < 0.75) itemType = "T";
        else if (rng <= 1) itemType = "R";
        return itemType;
    }

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
            if (baddy.component && baddy.component.tick && baddy.alive) {
                baddy.component.tick();
                i = 0;
                while (i < playerBullets.length) {
                    let bull = playerBullets[i];
                    if (baddy.component.checkBullet(bull)) {
                        playerBullets.splice(i, 1);
                        i--;
                        if (baddy.component.health == 0) {
                            collectables = [...collectables, {
                                x: baddy.component.xPos - 15,
                                y: baddy.component.yPos,
                                type: getRandomItemType(),
                                angle: 0,
                            }, {
                                x: baddy.component.xPos + 15,
                                y: baddy.component.yPos,
                                type: getRandomItemType(),
                                angle: 0,
                            }];
                        }
                    }
                    i++;
                }
                if (frame % 50 == 0) {
                    enemyBullets = [...enemyBullets, ...baddy.component.createBullet()];
                }
                if (baddy.x < 0) baddy.x = 0;
                if (baddy.y < 0) baddy.y = 0;
                if (baddy.x > arenaWidth) baddy.x = arenaWidth;
                if (baddy.y > arenaHeight) baddy.y = arenaHeight;
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
                else if (playerShipComponent.checkBullet(bull)) {
                    enemyBullets.splice(i, 1);
                    i--;
                    (new Audio(blockHitSound)).play();
                }

            i++;
        }
        enemyBullets = enemyBullets;

        /*i = 0;
        while (i < enemies.length) {
            if (enemies[i].alive === false) {
                enemies.splice(i, 1);
                break;
            }
            else i++;
        }
        enemies = enemies;*/
        enemiesRemaining = 0;
        for (let baddy of enemies) {
            if (baddy.alive) enemiesRemaining++;
        }

        i = 0;
        while (i < collectables.length) {
            let coll = collectables[i];
            coll.angle += 1;
            if (Math.pow(coll.x - playerPos.x, 2) + Math.pow(coll.y - playerPos.y, 2) <= 5000) {
                inventory[coll.type]++;
                collectables.splice(i, 1);
                i--;
                (new Audio(pickupSound)).play();
            }
            i++;
        }
        collectables = collectables;

        /*if (frame > 10 && enemies.length == 0) setTimeout(() => {
            exitStage(true);
        }, 2222);*/

        requestAnimationFrame(tick);
    }

    let playerShipBody = [];
    let shipStr = "";

    let levelOn;
    let inventory;
    let enemiesRemaining = 1;
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
        else levelOn = 1;
        if (localStorage.getItem("inventory")) {
            inventory = JSON.parse(localStorage.getItem("inventory"));
        }

        if (levelOn == 2) {
            enemies.push(
                {
                    type: "fighter",
                    component: null,
                    x: 1000, y: 200,
                    alive: true,
                },
                {
                    type: "scout",
                    component: null,
                    x: 1000, y: 1800,
                    alive: true,
                },
                {
                    type: "scout",
                    component: null,
                    x: 1800, y: 1000,
                    alive: true,
                },
                {
                    type: "fighter",
                    component: null,
                    x: 200, y: 1000,
                    alive: true,
                },
            );
        }
        else if (levelOn == 3) {
            enemies.push(
                {
                    type: "fighter",
                    component: null,
                    x: 1000, y: 200,
                    alive: true,
                },
                {
                    type: "scout",
                    component: null,
                    x: 1000, y: 1800,
                    alive: true,
                },
                {
                    type: "scout",
                    component: null,
                    x: 1800, y: 900,
                    alive: true,
                },
                {
                    type: "scout",
                    component: null,
                    x: 1800, y: 1100,
                    alive: true,
                },
                {
                    type: "fighter",
                    component: null,
                    x: 200, y: 900,
                    alive: true,
                },
                {
                    type: "fighter",
                    component: null,
                    x: 200, y: 1100,
                    alive: true,
                },
                {
                    type: "carrier",
                    component: null,
                    x: 1900, y: 500,
                    alive: true,
                },
            );

        }

        window.addEventListener("keydown", (e) => {
            inputs[e.key] = true;
        });
        window.addEventListener("keyup", (e) => {
            inputs[e.key] = false;
        });
        tick();

        /*window.addEventListener("click", (e) => {
            enemyBullets.push({
                x: e.clientX - cameraLeft,
                y: e.clientY - cameraTop,
                speed: 0,
                angle: 0,
            });
        });*/
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
    style:background-image="url('{{ 1: backdrop1, 2: backdrop2, 3: backdrop3 }[levelOn]}')"
    style:background-size="cover"
    style:background-position="center">
    <Ship bind:xPos={playerPos.x} bind:yPos={playerPos.y} bind:body={playerShipBody} bind:this={playerShipComponent} />
    {#each playerBullets as bull}
        <Bullet xPos={bull.x} yPos={bull.y} angle={bull.angle} blue />
    {/each}
    {#each enemies as baddy}
        <Enemy type={baddy.type} bind:this={baddy.component} playerPos={playerPos}
            bind:xPos={baddy.x} bind:yPos={baddy.y} bind:alive={baddy.alive} />
    {/each}
    {#each enemyBullets as bull}
        <Bullet xPos={bull.x} yPos={bull.y} angle={bull.angle} />
    {/each}
    {#each collectables as coll}
        <Collectable xPos={coll.x} yPos={coll.y} type={coll.type} angle={coll.angle} />
    {/each}
</div>

<span style:position="fixed"
    style:top="20px"
    style:left="20px"
    style:color="white">
    Level {levelOn} <br />    
    Enemies remaining: {enemiesRemaining}
</span>

{#if enemiesRemaining == 0}
    <div style:position="fixed"
        style:text-align="center"
        style:top="50vh"
        style:left="50vw"
        style:transform="translate(-50%, -50%)">
        <img src={levelCompleteSign} alt="Mission Complete" width={414} />
        <br /> <br />
        <input type="image"
            src={proceedButton}
            style:width="180px"
            on:click={() => { exitStage(true); }} alt="PROCEED" />
    </div>
{:else}
    <input type="image"
        src={resignButton}
        style:position="fixed"
        style:top="10px"
        style:right="10px"
        style:width="140px"
        on:click={() => { exitStage(false); }} alt="CONCEDE" />
    <input type="image"
        src={menuButton}
        style:position="fixed"
        style:top="10px"
        style:right="160px"
        style:width="140px"
        on:click={() => {
            goto("../");
        }} alt="MAIN MENU" />
{/if}

<audio autoplay loop>
    <source src={themeSong} type="audio/wav" />
</audio>

{#if playerShipComponent && playerShipComponent.thrusting && playerShipComponent.getThrusterCount() > 0}
    <audio autoplay on:timeupdate={(e) => {
        let timeBuff = 0.5;
        if (e.target.currentTime > e.target.duration - timeBuff) {
            e.target.currentTime = 0;
            e.target.play();
        }
    }} on:play={(e) => {
        e.target.volume = 0.3;
    }}>
        <source src={thrustSound} type="audio/wav" />
    </audio>
{/if}

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

    span {
        font-family: "Copperplate", serif;
        line-height: 1.2em;
    }
</style>