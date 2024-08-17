<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import blockSprite from "$lib/ship_assets/block.png";
    import cockpitSprite from "$lib/ship_assets/cockpit.png";
    import gunSprite from "$lib/ship_assets/laser_gun.png";
    import reactorSprite from "$lib/ship_assets/reactor.png";
    import thrusterSprite from "$lib/ship_assets/thruster.png";

    let fillMap = {
        ".": "",
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

    let inventory = {
        "B": 5,
        "C": 1,
        "G": 2,
        "R": 2,
        "T": 2,
    }
    let selectedTile = "B";
</script>

<table>
    <tr>
        {#each Object.keys(inventory) as key}
            {@const count = inventory[key]}
            <td style:background-image={fillMap[key]} style:transform="rotate(0)"
                style:outline={selectedTile == key ? "3px solid red" : ""}
                on:click={() => { selectedTile = key; }}>
                <span style:color="white" style:background-color="black">
                    x{count}
                </span>
            </td>
        {/each}
    </tr>
</table>
<br />

<table>
    {#each shipArr as row, r}
        <tr>
            {#each row as cell, c}
                <td style:background-image={fillMap[cell]}
                    on:click={() => {
                        shipArr[r][c] = selectedTile;
                    }}
                    on:contextmenu={(e) => {
                        e.preventDefault();
                        shipArr[r][c] = ".";
                    }}>
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
        width: 60px;
        height: 60px;
        border: 1px solid red;
        transform: rotate(90deg);
        background-size: contain;
        user-select: none;
    }

    table {
        border-spacing: 0;
        border-collapse: collapse;
    }
</style>