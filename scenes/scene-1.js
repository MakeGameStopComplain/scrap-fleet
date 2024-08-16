import { Scene } from "../lib/phaser.esm.min.js"
import Handler from "../handler.js";
import Player from "../entities/Player.js";

class Scene1 extends Scene {

    handler;

    constructor() {
        super("scene-1");
        this.handler = new Handler()
    }

    preload() {}

    create() {
        this.player = new Player(this.handler, this, "");
        this.handler.addEntity(this.player);
        
    }

    update() {
        this.handler.update();
    }

}

export default Scene1;