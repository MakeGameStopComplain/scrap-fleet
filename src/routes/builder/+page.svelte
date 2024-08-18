<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import blockSprite from "$lib/ship_assets/block.png";
    import cockpitSprite from "$lib/ship_assets/cockpit.png";
    import gunSprite from "$lib/ship_assets/laser_gun.png";
    import reactorSprite from "$lib/ship_assets/reactor.png";
    import thrusterSprite from "$lib/ship_assets/thruster.png";
    import menuMusic from "$lib/audio/menu_and_building_song.wav";
    import startButton from "$lib/gui_assets/start_level.png";

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
        localStorage.setItem("inventory", JSON.stringify(inventory));
        goto("/arena");
    }

    onMount(() => {
        if (localStorage.getItem("shipStr")) {
            shipStr = localStorage.getItem("shipStr");
        }
        if (localStorage.getItem("inventory")) {
            inventory = JSON.parse(localStorage.getItem("inventory"));
        }
        getShipArr();
    });

    let inventory = {
        "B": 5,
        "C": 0,
        "G": 2,
        "R": 2,
        "T": 2,
    }
    let selectedTile = "B";
</script>

<div class="centered" style:text-align="center">

    <div style="display: inline-block;">
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
    </div>
    <br /> <br />

    <table>
        {#each shipArr as row, r}
            <tr>
                {#each row as cell, c}
                    {@const canPlaceTile = (() => {
                        if (inventory[selectedTile] <= 0) return false;
                        if (r == 3 && c == 3) return false;
                        if (selectedTile == "G") {
                            if (r < 6 && ["B", "C", "R"].includes(shipArr[r + 1][c])) {
                                return true;
                            }
                        }
                        else if (selectedTile == "T") {
                            if (r > 0 && ["B", "C", "R"].includes(shipArr[r - 1][c])) {
                                return true;
                            }
                        }
                        else {
                            if (r > 0 && shipArr[r - 1][c] != ".") {
                                return true;
                            }
                            if (c > 0 && shipArr[r][c - 1] != ".") {
                                return true;
                            }
                            if (c < 6 && shipArr[r][c + 1] != ".") {
                                return true;
                            }
                            if (r < 6 && shipArr[r + 1][c] != ".") {
                                return true;
                            }
                        }
                        return false;
                    })()}
                    <td style:background-image={fillMap[cell]}
                        style:background-color={canPlaceTile ? "#FF000055" : "#00000000"}
                        on:click={() => {
                            if (canPlaceTile) {
                                if (shipArr[r][c] != ".") {
                                    inventory[shipArr[r][c]]++;
                                }
                                shipArr[r][c] = selectedTile;
                                inventory[selectedTile]--;
                            }
                        }}
                        on:contextmenu={(e) => {
                            e.preventDefault();
                            if ((r != 3 || c != 3) && shipArr[r][c] != ".") {
                                inventory[shipArr[r][c]]++;
                                shipArr[r][c] = ".";
                            }
                        }}>
                    </td>
                {/each}
            </tr>
        {/each}
    </table>
    <br />
    <input type="image" on:click={saveButton}
        src={startButton} alt="START" style:width="200px" />

</div>

<audio autoplay loop>
    <source src={menuMusic} type="audio/wav" />
</audio>

<style>
    :global(body) {
        margin: none;
        background-color: black;
    }

    table td {
        width: 40px;
        height: 40px;
        border: 1px solid red;
        transform: rotate(90deg);
        background-size: contain;
        user-select: none;
        vertical-align: top;
        text-align: right;
    }

    table {
        border-spacing: 0;
        border-collapse: collapse;
    }

    .centered {
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
    }
</style>