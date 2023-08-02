import { Engine, Sprite } from "game";
import { Colour, enemyKeyBindings, playerKeyBindings } from "utils";

let engine: Engine;
let player: Sprite;
let enemy: Sprite;

function run(): void {
    engine = new Engine();

    player = engine.createSprite({
        position: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
        playerControlled: true,
        keyBindings: playerKeyBindings,
        colour: Colour.Green,
    });
    
    enemy = engine.createSprite({
        position: { x: 400, y: 100 },
        velocity: { x: 0, y: 0 },
        playerControlled: false,
        keyBindings: enemyKeyBindings,
        colour: Colour.Red,
    });
}

function animate(): void {
    requestAnimationFrame(animate);
    
    engine.getContext().fillStyle = 'black';
    engine.getContext().fillRect(0, 0, engine.getCanvas().width, engine.getCanvas().height);
    
    player.udpate();
    enemy.udpate();
};

run();
animate();
