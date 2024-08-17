<script context="module">
    let current;
</script>

<script>
    import { onMount } from "svelte";

    export let body = [
        [".",".",".",".",".",".","."],
        [".",".","#","#","#",".","."],
        [".",".",".","#",".",".","."],
        [".",".","#","#","#",".","."],
        [".",".",".","#",".",".","."],
        [".",".","#","#","#",".","."],
        [".",".",".",".",".",".","."],
    ];

    let cellSize = 24;

    let fillMap = {
        ".": "transparent",
        "#": "red",
    };

    export let xPos = 200;
    export let yPos = 200;
    export let angle = 0;
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
            ></div>
        {/each}
    {/each}

</div>

<style>
</style>