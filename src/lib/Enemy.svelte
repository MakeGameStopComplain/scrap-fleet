<script context="module">
    let current;
</script>
<svelte:options accessors={true} />

<script>
    import carrierSprite from "$lib/enemy_assets/carrier.png";
    import fighterSprite from "$lib/enemy_assets/fighter.png";
    import scoutSprite from "$lib/enemy_assets/scout.png";

    export let type = "scout";
    export let xPos = 100;
    export let yPos = 100;
    export let angle = 0;
    export let alive = true;
    /**
     * 
     * @param {object} bulletPos
     * @param {number} bulletPos.x
     * @param {number} bulletPos.y
     */
    export function checkBullet(bulletPos) {
        let distance = Math.sqrt(Math.pow(bulletPos.x - xPos, 2) + Math.pow(bulletPos.y - yPos, 2));
        if (distance < 75) alive = false;
    }
    export function tick() {
        angle += 10;
    }
</script>

{#if alive}
    {#if type == "scout"}
        <div style:position="absolute"
            style:width="100px"
            style:height="100px"
            style:background-image="url('{scoutSprite}')"
            style:background-size="100% 100%"
            style:top="{yPos}px"
            style:left="{xPos}px"
            style:transform="translate(-50%, -50%) rotate({90 + angle}deg)"></div>
    {:else if type == "fighter"}
        <div style:position="absolute"
            style:width="100px"
            style:height="100px"
            style:background-image="url('{fighterSprite}')"
            style:background-size="100% 100%"
            style:top="{yPos}px"
            style:left="{xPos}px"
            style:transform="translate(-50%, -50%) rotate({90 + angle}deg)"></div>
    {:else if type == "carrier"}
        <div style:position="absolute"
            style:width="100px"
            style:height="100px"
            style:background-image="url('{carrierSprite}')"
            style:background-size="100% 100%"
            style:top="{yPos}px"
            style:left="{xPos}px"
            style:transform="translate(-50%, -50%) rotate({90 + angle}deg)"></div>
    {/if}
{/if}