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

<button on:click={() => { goto("/arena"); }}>fight</button>
<button on:click={() => { goto("/builder"); }}>build</button>

<audio autoplay loop>
    <source src={menuMusic} type="audio/wav" />
</audio>