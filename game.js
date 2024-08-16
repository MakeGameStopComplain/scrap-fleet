// phaser
import { Game } from "./lib/phaser.esm.min.js";
// scenes
import MainMenu from "./scenes/main-menu.js";
import Scene1 from "./scenes/scene-1.js";


const gameWidth = 640 * 1.5;
const gameHeight = 360 * 1.5;

window.onload = function() {
    var config = {
        width: gameWidth,
        height: gameHeight,
        physics: {
            default: "arcade",
            arcade: {
                gravity: { y: 0, x: 0 },
                debug: false,
                fps: 60
            }
        },
        scene: [MainMenu, Scene1],
        antialias: false,
        pixelArt: true
    };
    
    var game = new Game(config);
};