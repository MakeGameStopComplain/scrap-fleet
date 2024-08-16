// phaser
import { Game } from "./lib/phaser.esm.min.js";
// scenes
import MainMenu from "./scenes/main-menu.js";
import Scene1 from "./scenes/scene-1.js";


const gameWidth = 960;
const gameHeight = 540;

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
        antialias: true,
        pixelArt: false
    };
    
    var game = new Game(config);
};