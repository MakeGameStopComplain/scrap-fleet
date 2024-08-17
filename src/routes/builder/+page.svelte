<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import blockSprite from "$lib/ship_assets/block.png";
    import cockpitSprite from "$lib/ship_assets/cockpit.png";
    import gunSprite from "$lib/ship_assets/laser_gun.png";
    import reactorSprite from "$lib/ship_assets/reactor.png";
    import thrusterSprite from "$lib/ship_assets/thruster.png";

    let fillMap = {
        ".": "transparent",
        "B": `url("${blockSprite}")`,
        "C": `url("${cockpitSprite}")`,
        "G": `url("${gunSprite}")`,
        "R": `url("${reactorSprite}")`,
        "T": `url("${thrusterSprite}")`,
    };
    
    let shipStr = ".......\n" +
    "..###..\n" +
    "...#...\n" +
    "..###..\n" +
    "...#...\n" +
    "..###..\n" +
    ".......";
    let shipArr = [];
    
    function getShipArr() {
        shipArr = [];
        for (let r of shipStr.split("\n")) {
            let row = r.split("");
            shipArr.push(row);
        }
        shipArr = shipArr;
    }
    function getShipStr() {
        shipStr = "";
        let rows = [];
        for (let row of shipArr) {
            rows.push(row.join(""));
        }
        shipStr = rows.join("\n");
    }

    function saveButton() {
        getShipStr();
        localStorage.setItem("shipStr", shipStr);
        goto("/");
    }

    onMount(() => {
        if (localStorage.getItem("shipStr")) {
            shipStr = localStorage.getItem("shipStr");
        }
        getShipArr();
    });
</script>

<table>
    {#each shipArr as row, r}
        <tr>
            {#each row as cell, c}
                <td style:background-image={fillMap[cell]}>
                    <input type="text" bind:value={shipArr[r][c]} style:width="50px" />
                </td>
            {/each}
        </tr>
    {/each}
</table>
<br />
<button on:click={saveButton}>Return to le main menu</button>

<style>
    :global(body) {
        margin: none;
        background-color: black;
    }

    table td {
        width: 100px;
        height: 100px;
        border: 1px solid red;
        transform: rotate(90deg);
        background-size: contain;
    }

    table {
        border-spacing: 0;
        border-collapse: collapse;
    }
</style>