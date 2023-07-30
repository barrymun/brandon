import { Game, Sprite } from "src/game";

let game: Game;
let player: Sprite;
let enemy: Sprite;

function run(): void {
    game = new Game();

    player = game.createSprite({
        position: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
    });
    
    enemy = game.createSprite({
        position: { x: 400, y: 100 },
        velocity: { x: 0, y: 0 },
    });
}

function animate(): void {
    requestAnimationFrame(animate);
    
    game.getContext().fillStyle = 'black';
    game.getContext().fillRect(0, 0, game.getCanvas().width, game.getCanvas().height);
    
    player.udpate();
    enemy.udpate();
};

run();
animate();
