import Phaser from './lib/phaser.js';
import { SCENE_KEYS } from './scenes/scenekeys.js';
import { GameScene } from './scenes/gamescene.js';

const game = new Phaser.Game({
    type: Phaser.WEBGL,
    pixelArt: false,
    scale: {
        width: 980,
        height: 600,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    dom: {
        createContainer: true
    },
    parent: 'game-container',
    backgroundColor: '#FFFFFF',
});
game.scene.add(SCENE_KEYS.GAME_SCENE, GameScene);

game.scene.start(SCENE_KEYS.GAME_SCENE, GameScene);