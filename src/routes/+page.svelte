<script>
    import { goto } from "$app/navigation";
    import menuMusic from "$lib/audio/menu_and_building_song.wav";
    import { onMount } from "svelte";
    import startButtonImg from "$lib/gui_assets/start.png";
    import logo from "$lib/gui_assets/scrap_fleet_logo.png";
    import continueButton from "$lib/gui_assets/continueGame.png";
    import controlsImage from "$lib/controls.png";
    import menuButton from "$lib/gui_assets/main_menu.png";
    import controlsButton from "$lib/gui_assets/controls.png";

    let saveFileEmpty = true;

    onMount(() => {
        if (!localStorage.getItem("shipStr")) {
            localStorage.setItem("shipStr",
                ".......\n" +
                ".......\n" +
                "...G...\n" +
                "..BCR..\n" +
                "...T...\n" +
                ".......\n" +
                ".......\n"
            );
        }
        else {
            saveFileEmpty = false;
        }
        if (!localStorage.getItem("inventory")) {
            localStorage.setItem("inventory", JSON.stringify({
                "B": 0,
                "C": 0,
                "G": 0,
                "R": 0,
                "T": 0,
            }));
        }
        if (!localStorage.getItem("levelOn")) {
            localStorage.setItem("levelOn", 1);
        }
    });

    let showControls = false;
</script>

<div id="mainScreen">
    <div class="centered" style:text-align="center">
        <img src={logo} alt="SCRAP FLEET" width={400} />
        <br />
        {#if !saveFileEmpty}
            <input type="image" on:click={() => { goto("./loading"); }}
                src={continueButton} alt="CONTINUE GAME" style:width="160px" />
        {/if}
        <br /> <br />
        <input type="image" on:click={() => {
                localStorage.clear();
                goto("./loading");
            }}
            src={startButtonImg} alt="NEW GAME" style:width="160px" />
        <br /> <br />
        <input type="image" on:click={() => {
                showControls = true;
            }}
            src={controlsButton} alt="CONTROLS" style:width="160px" />
    </div>
</div>

{#if showControls}
    <div style:position="fixed"
        style:top="0"
        style:left="0"
        style:width="100vw"
        style:height="100vh"
        style:background-color="#202020">
        <div class="centered" style:text-align="center">
            <img src={controlsImage} alt="wasd to move, k to shoot" height={414} />
            <br /> <br />
            <input type="image" on:click={() => {
                    showControls = false;
                }}
                src={menuButton} alt="MAIN MENU" style:width="160px" />
        </div>
    </div>
{/if}

<audio autoplay loop>
    <source src={menuMusic} type="audio/wav" />
</audio>

<style>
    #mainScreen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-size: cover;
        background-position: center;
        background-image: url($lib/backgrounds/background1.png);
    }

    .centered {
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
    }

    input[type=image] {
        transition: transform 0.2s;
    }

    input[type=image]:hover {
        transform: scale(1.1);
    }
</style>