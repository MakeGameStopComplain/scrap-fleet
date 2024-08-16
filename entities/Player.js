import Entity from "./entity.js";
import { Input } from "../lib/phaser.esm.min.js";

class Player extends Entity {
    constructor(handler, scene, spriteName) {
        super(handler, scene, spriteName, "player");
        
        this.handler = handler;
        this.scene = scene;

        this.Button1 = this.scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.Z);
        this.Button2 = this.scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.X);
        this.Button3 = this.scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.C);
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.sprite.setCollideWorldBounds(true);
        this.sprite.setDragX(4300);
        this.sprite.setGravityY(1700);
        this.sprite.scale = 1;
        this.sprite.body.setSize(16, 16).setOffset(8, 16);
        this.sprite.flipX = true;
        this.velocityCapX = 1000;
        this.velocityCapY = 850;
        this.speed = 100;
    }

    update() {
        let velocityX = this.sprite.body.velocity.x;
        let velocityY = this.sprite.body.velocity.y;
        let accelerating = false;

        const clamp = (x, a, b) => {
            return Math.max(Math.min(x, a), b);
        }

        if (this.cursors.left.isDown) {
            // Caps the speed in the purple world
            if (this.scene.timeState !== "apocalyptic" || this.sprite.body.velocity.x > -600) {
                velocityX -= this.speed;
            } else {
                velocityX -= this.speed * 9 / 10;
            }
            this.sprite.flipX = false;
            accelerating = true;
        }
        if (this.cursors.right.isDown) {
            if (this.scene.timeState !== "apocalyptic" || this.sprite.body.velocity.x < 600) {
                velocityX += this.speed;
            } else {
                velocityX += this.speed * 9 / 10;
            }
            this.sprite.flipX = true;
            accelerating = true;
        }
        if ((Input.Keyboard.JustDown(this.cursors.up) || Input.Keyboard.JustDown(this.Button2)) && 
            this.sprite.body.blocked.down) 
        {
            velocityY = -1000;
            this.scene.sound.add("jumpsound").play();
        }

        this.sprite.setVelocity(clamp(velocityX, this.velocityCapX, -this.velocityCapX), clamp(this.velocityY, this.velocityCapY, -this.velocityCapY));

        if (Math.abs(velocityX) > 5) {
            this.sprite.play("normal-player-run", true);
        } else {
            this.sprite.play("normal-player-idle", true);
        }

        super.update();
    }
    
}

export default Player;