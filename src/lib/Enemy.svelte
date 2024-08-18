<script context="module">
    let current;
</script>
<svelte:options accessors={true} />

<script>
    import carrierSprite from "$lib/enemy_assets/carrier.png";
    import fighterSprite from "$lib/enemy_assets/fighter.png";
    import scoutSprite from "$lib/enemy_assets/scout.png";
    import laserSound from "$lib/audio/laser_sound.wav";

    export let type = "scout";
    export let xPos = 100;
    export let yPos = 100;
    export let angle = 0;
    export let alive = true;
    export let engaged = false;
    export let playerPos = { x: 0, y: 0, angle: 0, };
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

    let speed = 4;
    let engagementRing = 500;
    let rotationalSpeed = 0.1;
    export function tick() {
        if (!engaged) angle += 2;
        else {
            let dangle = Math.atan2(playerPos.y - yPos, playerPos.x - xPos) * 180 / Math.PI + 90;
            angle = dangle * rotationalSpeed + angle * (1 - rotationalSpeed);
            xPos += Math.cos(angle) * speed;
            yPos += Math.sin(angle) * speed;
        }

        if (Math.pow(playerPos.x - xPos, 2) + Math.pow(playerPos.y - yPos, 2) <= Math.pow(engagementRing, 2)) {
            engaged = true;
        }
    }
    export function createBullet() {
        if (!engaged) return [];
        (new Audio(laserSound)).play();
        if (type == "scout") {
            let dist = 25;
            let angle1 = Math.PI * 7 / 4 + angle * Math.PI / 180;
            let angle2 = Math.PI * 5 / 4 + angle * Math.PI / 180;
            return [{
                x: xPos + Math.cos(angle1) * dist,
                y: yPos + Math.sin(angle1) * dist,
                angle: angle,
                speed: 24,
            }, {
                x: xPos + Math.cos(angle2) * dist,
                y: yPos + Math.sin(angle2) * dist,
                angle: angle,
                speed: 24,
            }];
        }
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