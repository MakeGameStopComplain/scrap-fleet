<script context="module">
    let current;
</script>
<svelte:options accessors={true} />

<script>
    import carrierSprite from "$lib/enemy_assets/carrier.png";
    import fighterSprite from "$lib/enemy_assets/fighter.png";
    import scoutSprite from "$lib/enemy_assets/scout.png";
    import laserSound from "$lib/audio/laser_sound.wav";
    import deathSound from "$lib/audio/explosion_sound.wav";
    import { onMount } from "svelte";

    let hitboxRadius = 75;

    export let type = "scout";
    export let xPos = 100;
    export let yPos = 100;
    export let angle = 0;
    export let alive = true;
    export let engaged = false;
    export let playerPos = { x: 0, y: 0, angle: 0, };
    export let health = 4;
    /**
     * 
     * @param {object} bulletPos
     * @param {number} bulletPos.x
     * @param {number} bulletPos.y
     */
    export function checkBullet(bulletPos) {
        let distance = Math.sqrt(Math.pow(bulletPos.x - xPos, 2) + Math.pow(bulletPos.y - yPos, 2));
        if (distance < hitboxRadius) {
            health--;
            if (health == 0) {
                alive = false;
                (new Audio(deathSound)).play();
            }
            return true;
        }
        return false;
    }

    let speed = 4;
    let engagementRing = 600;
    let rotationalSpeed = 0.05;
    let orbitRadius = 400;
    export function tick() {
        if (!engaged) {
            if (type == "scout") angle += 2;
        }
        else {
            let dangle = Math.atan2(playerPos.y - yPos, playerPos.x - xPos) * 180 / Math.PI + 90;
            angle = angle % 360;
            angle = dangle * rotationalSpeed + angle * (1 - rotationalSpeed);
            angle = angle % 360;
            let distFromPlayer = Math.sqrt(Math.pow(playerPos.y - yPos, 2) + Math.pow(playerPos.x - xPos, 2));
            if (distFromPlayer >= orbitRadius) {
                xPos += Math.cos((angle - 90) * Math.PI / 180) * speed;
                yPos += Math.sin((angle - 90) * Math.PI / 180) * speed;
            }
        }

        if (Math.pow(playerPos.x - xPos, 2) + Math.pow(playerPos.y - yPos, 2) <= Math.pow(engagementRing, 2)) {
            engaged = true;
        }
    }
    export function createBullet() {
        if (!alive) return [];
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
        else if (type == "carrier") {
            let dist = 75;
            let angle1 = Math.PI * 5 / 4 + angle * Math.PI / 180;
            return [{
                x: xPos + Math.cos(angle1) * dist,
                y: yPos + Math.sin(angle1) * dist,
                angle: angle,
                speed: 24,
            }];
        }
        else if (type == "fighter") {
            let dist = 32;
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
        return [];
    }

    onMount(() => {
        if (type == "carrier") {
            angle = 90;
            speed = 0.2;
            rotationalSpeed = 0.01;
            hitboxRadius = 120;
            engagementRing = 1200;
            health = 10;
        }
        else if (type == "fighter") {
            angle = 90;
            speed = 6;
            engagementRing = 414;
            rotationalSpeed = 0.2;
            health = 6;
            hitboxRadius = 75;
        }
    });
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
            style:width="200px"
            style:height="200px"
            style:background-image="url('{carrierSprite}')"
            style:background-size="100% 100%"
            style:top="{yPos}px"
            style:left="{xPos}px"
            style:transform="translate(-50%, -50%) rotate({90 + angle}deg)"></div>
    {/if}
{/if}