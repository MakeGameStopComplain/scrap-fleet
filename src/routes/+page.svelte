<script>
    import { goto } from "$app/navigation";
    import menuMusic from "$lib/audio/menu_and_building_song.wav";
    import { onMount } from "svelte";

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
    <div class="centered">
        <button on:click={() => { goto("/arena"); }}>fight</button>
        <button on:click={() => { goto("/builder"); }}>build</button>
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
</style>