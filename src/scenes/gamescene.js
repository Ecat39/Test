import Phaser from '../lib/phaser.js';
import { SCENE_KEYS } from './scenekeys.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.GAME_SCENE,
        });
    }

    preload() {
        this.load.image('background', 'assets/980x600.png');
    }

    create() {
        this.add.image(0,0,'background').setOrigin(0);

        // ==Camera Pan and Zoom Function==
        this.cameras.main.setZoom(1);

        let cameradragstartx;
        let cameradragstarty;

        // testing purposes
        this.input.on('pointerdown', (pointer) => {
            console.log(pointer.x + '/' + pointer.y);
        });

        this.input.on('pointerdown', () => {
            cameradragstartx = this.cameras.main.scrollX;
            cameradragstarty = this.cameras.main.scrollY;
        });

        this.input.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                this.cameras.main.scrollX = Phaser.Math.Clamp(cameradragstartx + (pointer.downX - pointer.x) / this.cameras.main.zoom, -800 / this.cameras.main.zoom, 800 / this.cameras.main.zoom);
                this.cameras.main.scrollY = Phaser.Math.Clamp(cameradragstarty + (pointer.downY - pointer.y) / this.cameras.main.zoom, -350 / this.cameras.main.zoom, 350/ this.cameras.main.zoom);
            }
        });

        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            // Get the current world point under pointer.
            const worldpoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            const newzoom = Phaser.Math.RoundTo(this.cameras.main.zoom - this.cameras.main.zoom * 0.00075 * deltaY, -2);
            this.cameras.main.zoom = Phaser.Math.Clamp(newzoom, 0.25, 2);
            console.log(this.cameras.main.zoom);

            // Update camera matrix, so getWorldPoint returns zoom-adjusted coordinates.
            this.cameras.main.shakeEffect.preRender();
            const newWorldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            // Scroll the camera to keep the pointer under the same world point.
            this.cameras.main.scrollX -= newWorldPoint.x - worldpoint.x;
            this.cameras.main.scrollY -= newWorldPoint.y - worldpoint.y;
        });
    }
}