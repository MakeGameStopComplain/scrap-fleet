import { Scene } from "../lib/phaser.esm.min.js"

class MainMenu extends Scene {
    constructor() {
        super("main-menu");
    }

    preload() {
        this.load.image("playButton", "/images/playButton.png");
    }

    create() {
        this.playButton = this.add.image(480, 270, "playButton");
        this.playButton.setScale(0.5);
        this.playButton.setInteractive();
        this.playButton.on("pointerdown", () => {
            this.scene.start("scene-1");
        });
    }

    update() {}

}

export default MainMenu;