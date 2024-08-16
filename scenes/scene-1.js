import { Scene } from "../lib/phaser.esm.min.js"
import Handler from "../handler.js";

class Scene1 extends Scene {

    handler;

    constructor() {
        super("scene-1");
        this.handler = new Handler()
    }

    preload() {}

    create() {}

    update() {
        this.handler.update();
    }

}

export default Scene1;