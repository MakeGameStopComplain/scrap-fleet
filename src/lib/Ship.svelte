<script context="module">
    let current;
</script>
<svelte:options accessors={true} />

<script>
    import { onMount } from "svelte";
    import blockSprite from "$lib/ship_assets/block.png";
    import cockpitSprite from "$lib/ship_assets/cockpit.png";
    import gunSprite from "$lib/ship_assets/laser_gun.png";
    import reactorSprite from "$lib/ship_assets/reactor.png";
    import thrusterSprite from "$lib/ship_assets/thruster.png";
    import damagedBlockSprite from "$lib/ship_assets/damaged_block.png";
    import damagedCockpitSprite from "$lib/ship_assets/damaged_cockpit.png";
    import damagedReactorSprite from "$lib/ship_assets/damaged_reactor.png";
    import damagedGunSprite from "$lib/ship_assets/damaged_gun.png";
    import damagedThrusterSprite from "$lib/ship_assets/damaged_thruster.png";
    import thrusterFire1 from "$lib/ship_assets/thruster_fire_frame1.png";
    import thrusterFire2 from "$lib/ship_assets/thruster_fire_frame2.png";
    import laserSound from "$lib/audio/laser_sound.wav";

    export let body = [
        [".",".",".",".",".",".","."],
        [".",".","B","B","B",".","."],
        [".",".",".","B",".",".","."],
        [".",".","B","C","B",".","."],
        [".",".",".","B",".",".","."],
        [".",".","B","B","B",".","."],
        [".",".",".",".",".",".","."],
    ];

    let cellSize = 36;

    let fillMap = {
        ".": "",
        "B": `url("${blockSprite}")`,
        "C": `url("${cockpitSprite}")`,
        "G": `url("${gunSprite}")`,
        "R": `url("${reactorSprite}")`,
        "T": `url("${thrusterSprite}")`,
        "b": `url("${damagedBlockSprite}")`,
        "c": `url("${damagedCockpitSprite}")`,
        "g": `url("${damagedGunSprite}")`,
        "r": `url("${damagedReactorSprite}")`,
        "t": `url("${damagedThrusterSprite}")`,
    };

    export let xPos = 200;
    export let yPos = 200;
    export let angle = 0;
    export function checkBullet(bulletPos) {
        let radialAngle = Math.atan2(xPos - bulletPos.x, yPos - bulletPos.y) + angle * Math.PI / 180;
        let radialDistance = Math.sqrt(Math.pow(bulletPos.y - yPos, 2) + Math.pow(bulletPos.x - xPos, 2));
        let r = Math.floor(body.length / 2 - Math.cos(radialAngle) * radialDistance / cellSize);
        let c = Math.floor(body[0].length / 2 - Math.sin(radialAngle) * radialDistance / cellSize);

        if (r >= 0 && r < body.length && c >= 0 && c < body[0].length) {
            if (body[r][c] != body[r][c].toLowerCase()) {
                body[r][c] = body[r][c].toLowerCase();
                return true;
            }
            else if (body[r][c] != ".") {
                body[r][c] = ".";
                return true;
            }
        }
        return false;
    };
    export let velocityX = 0;
    export let velocityY = 0;
    export let thrusting = 0;
    export function rotate(deg=5) {
        angle += deg;
    }
    export function getThrusterCount() {
        let count = 0;
        for (let row of body) {
            for (let cell of row) {
                if (cell.toUpperCase() == "T") count++;
            }
        }
        return count;
    }
    let fireFrame = 1;

    function gridIndexToCoords(r, c) {
        let radialAngle = Math.atan2(r - body.length / 2, c - body[0].length / 2);
        let radialDistance = Math.sqrt(Math.pow(r - body.length / 2, 2) + Math.pow(c - body[0].length / 2, 2));
        return {
            x: xPos + Math.cos(radialAngle + angle * Math.PI / 180) * cellSize * radialDistance,
            y: yPos + Math.sin(radialAngle + angle * Math.PI / 180) * cellSize * radialDistance,
        };
    }

    export function tick() {
        let thrusterCount = getThrusterCount();
        if (thrusting == 1) {
            velocityX += 0.5 * thrusterCount * Math.sin(angle * Math.PI / 180);
            velocityY += 0.5 * thrusterCount * Math.cos(angle * Math.PI / 180);
        }
        else if (thrusting == -1) {
            velocityX += 0.5 * thrusterCount * Math.sin(angle * Math.PI / 180);
            velocityY += 0.5 * thrusterCount * Math.cos(angle * Math.PI / 180);
        }
        else if (thrusting == 0) {
            velocityX /= 1.01;
            velocityY /= 1.01;
        }

        velocityX = Math.max(Math.min(velocityX, 5 * thrusterCount), -5 * thrusterCount);
        velocityY = Math.max(Math.min(velocityY, 5 * thrusterCount), -5 * thrusterCount);

        yPos -= velocityY;
        xPos += velocityX;

        if (fireFrame == 1) fireFrame = 2;
        else fireFrame = 1;
    }
    function getGunPositions() {
        let positions = [];
        let r = 0, c = 0;
        for (let row of body) {
            c = 0;
            for (let cell of row) {
                if (cell.toUpperCase() == "G") {
                    let radialAngle = Math.atan2(r - body.length / 2, c - body[0].length / 2);
                    let radialDistance = Math.sqrt(Math.pow(r - body.length / 2, 2) + Math.pow(c - body[0].length / 2, 2));
                    positions.push({
                        x: xPos + Math.cos(radialAngle + angle * Math.PI / 180) * cellSize * radialDistance,
                        y: yPos + Math.sin(radialAngle + angle * Math.PI / 180) * cellSize * radialDistance,
                    });
                }
                c++;
            }
            r++;
        }
        return positions;
    }
    export function createBullet() {
        let newBullets = [];
        for (let pos of getGunPositions()) {
            newBullets.push({
                x: pos.x,
                y: pos.y,
                angle: angle,
                speed: 24 + Math.sqrt(Math.pow(velocityX, 2) + Math.pow(velocityY, 2)),
            });
        }
        if (newBullets.length > 0) (new Audio(laserSound)).play();
        return newBullets;
    }

    onMount(() => {
        
    });
</script>

<div style:position="absolute"
    style:top="{yPos}px"
    style:left="{xPos}px"
    style:width="{cellSize * (body[0] || []).length}px"
    style:height="{cellSize * body.length}px"
    style:transform="translate(-50%, -50%) rotate({angle}deg)">
    {#each body as row, r}
        {#each row as cell, c}
            {@const fill = fillMap[cell]}
            <div style:position="absolute"
                style:top="{r * cellSize}px"
                style:left="{c * cellSize}px"
                style:width="{cellSize}px"
                style:height="{cellSize}px"
                style:background-image={fill}
                style:background-size="contain"
                style:transform="rotate(90deg)"
            ></div>
            {#if cell.toUpperCase() == "T" && thrusting}
                <div style:position="absolute"
                    style:top="{r * cellSize + cellSize}px"
                    style:left="{c * cellSize}px"
                    style:width="{cellSize}px"
                    style:height="{cellSize}px"
                    style:animation="thrusterFire 0.1s infinite"
                    style:background-size="contain"
                    style:transform="rotate(90deg)"
                    style:mix-blend-mode="screen"
                ></div>
            {/if}
        {/each}
    {/each}

</div>

<style>
    @keyframes -global-thrusterFire {
        0%, 100% {
            background-image: url($lib/ship_assets/thruster_fire_frame1.png);
        }
        50% {
            background-image: url($lib/ship_assets/thruster_fire_frame2.png);
        }
    }
</style>