import Phaser from '../lib/phaser.js';
import { SCENE_KEYS } from './scenekeys.js';

import {
    GAME_ASSET_KEYS,
} from '../assets/assetkeys.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.GAME_SCENE,
        });
    }

    preload() {
        this.load.tilemapTiledJSON(GAME_ASSET_KEYS.TESTMAP, 'assets/Data/testmap.json');
        this.load.image('terraintiles', 'assets/Tilesheets/terraintilesheet.png');
        this.load.image('resourcetiles', 'assets/Tilesheets/resourcetilesheet.png');
        this.load.spritesheet(GAME_ASSET_KEYS.CREATUREWALKRIGHT, 'assets/Animations/Creature/walkspritesheet.svg', { frameWidth: 120, frameHeight: 120 });
    }

    create() {
        // ==Map Setup==
        this.map1 = this.add.tilemap(GAME_ASSET_KEYS.TESTMAP);

        const tileSet1 = this.map1.addTilesetImage('terraintilesheet', 'terraintiles');
        const tileSet2 = this.map1.addTilesetImage('resourcetilesheet', 'resourcetiles');

        this.terrainLayer = this.map1.createLayer('Terrain', [ tileSet1 ], 340, -50).setOrigin(0, 0);;
        this.terrainLayer.setCollisionByProperty({ collides: true });
        this.resourceLayer = this.map1.createLayer('Structures', [ tileSet2 ], 340, -50).setOrigin(0, 0);;
        //this.resourceLayer = this.map1.createLayer('Structures', [ tileSet2 ], 340+50, -50-285);
        this.resourceLayer.setCollisionByProperty({ collides: true });
        
        this.terrainLayer.setCullPadding(8, 8);

        // ==Creature==
        const creatureSpritesheet = {
            key: 'walkright',
            frames: this.anims.generateFrameNumbers(GAME_ASSET_KEYS.CREATUREWALKRIGHT, { start: 0, end: 7}),
            frameRate: 20,
            repeat: -1
        };

        this.anims.create(creatureSpritesheet);
        this.add.sprite(this.map1.tileToWorldXY(0,0).x, this.map1.tileToWorldXY(0,0).y, GAME_ASSET_KEYS.CREATUREWALKRIGHT).play('walkright').setOrigin(0.5,0.5);
        console.log(this.map1.tileToWorldXY(0,0).x, this.map1.tileToWorldXY(0,0).y);

        // ==Camera Pan and Zoom Function==
        this.cameras.main.setZoom(0.3);

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
            const newzoom = Phaser.Math.RoundTo(this.cameras.main.zoom - this.cameras.main.zoom * 0.00075 * deltaY, -5);
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