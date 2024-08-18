<script>
    import { goto } from "$app/navigation";
    import menuMusic from "$lib/audio/menu_and_building_song.wav";
</script>

<button on:click={() => { goto("/arena"); }}>fight</button>
<button on:click={() => { goto("/builder"); }}>build</button>

<audio autoplay loop>
    <source src={menuMusic} type="audio/wav" />
</audio>