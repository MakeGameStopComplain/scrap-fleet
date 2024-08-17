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
        ".": "transparent",
        "B": `url("${blockSprite}")`,
        "C": `url("${cockpitSprite}")`,
        "G": `url("${gunSprite}")`,
        "R": `url("${reactorSprite}")`,
        "T": `url("${thrusterSprite}")`,
    };

    export let xPos = 200;
    export let yPos = 200;
    export let angle = 0;
    export function checkBullet(bulletPos) { 
        let incomingAngle = Math.atan2(bulletPos.y - yPos, bulletPos.x - xPos);
        let incomingDistance = Math.sqrt(Math.pow(bulletPos.y - yPos, 2), Math.pow(bulletPos.x - xPos, 2));
        let checkAngle = incomingAngle - angle * Math.PI / 180;
        let checkR = Math.round((Math.sin(checkAngle) * incomingDistance) / cellSize);
        let checkC = Math.round((Math.cos(checkAngle) * incomingDistance) / cellSize);
        if (checkR >= 0 && checkC >= 0 && checkR <= body.length && checkC <= body[0].length) {
            if (body[checkR][checkC] == ".") {
                body[checkR][checkC] = ".";
                return true;
            }
        }
        return false;
    };
    export let velocity = 0;
    export let thrusting = 0;
    export function rotate(deg=5) {
        angle += deg;
    }
    function getThrusterCount() {
        let count = 0;
        for (let row of body) {
            for (let cell of row) {
                if (cell.toUpperCase() == "T") count++;
            }
        }
        return count;
    }
    let fireFrame = 1;
    export function tick() {
        if (thrusting == 1) {
            velocity += 0.5 * getThrusterCount();
        }
        else if (thrusting == -1) {
            velocity -= 0.5 * getThrusterCount();
        }
        else if (thrusting == 0) {
            velocity /= 1.05;
        }

        velocity = Math.max(Math.min(velocity, 12), -12);

        yPos -= Math.cos(angle * Math.PI / 180) * velocity;
        xPos += Math.sin(angle * Math.PI / 180) * velocity;

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
                    positions.push({
                        x: xPos + Math.cos(radialAngle + angle * Math.PI / 180) * cellSize * 2,
                        y: yPos + Math.sin(radialAngle + angle * Math.PI / 180) * cellSize * 2,
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
            });
        }
        (new Audio(laserSound)).play();
        return newBullets;
    }
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
                style:background={fill}
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