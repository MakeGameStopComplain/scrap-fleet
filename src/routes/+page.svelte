<script>
    import { goto } from "$app/navigation";
    import menuMusic from "$lib/audio/menu_and_building_song.wav";
    import { onMount } from "svelte";
    import startButtonImg from "$lib/gui_assets/start.png";
    import logo from "$lib/gui_assets/scrap_fleet_logo.png";

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
        if (!localStorage.getItem("inventory")) {
            localStorage.setItem("inventory", JSON.stringify({
                "B": 0,
                "C": 0,
                "G": 0,
                "R": 0,
                "T": 0,
            }));
        }
    });
</script>

<div id="mainScreen">
    <div class="centered" style:text-align="center">
        <img src={logo} alt="SCRAP FLEET" width={400} />
        <br />
        <input type="image" on:click={() => { goto("./builder"); }}
            src={startButtonImg} alt="START" style:width="200px" />
    </div>
</div>

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