<script context="module">
    let current;
</script>

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

    export let body = [
        [".",".",".",".",".",".","."],
        [".",".","B","B","B",".","."],
        [".",".",".","B",".",".","."],
        [".",".","B","C","B",".","."],
        [".",".",".","B",".",".","."],
        [".",".","B","B","B",".","."],
        [".",".",".",".",".",".","."],
    ];

    let cellSize = 24;

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
            ></div>
        {/each}
    {/each}

</div>

<style>
</style>