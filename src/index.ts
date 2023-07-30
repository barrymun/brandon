import { Game } from "src/game";

function start(): void {
    const game = new Game();

    const player = game.createSprite({ x: 0, y: 0 });
    const enemy = game.createSprite({ x: 400, y: 100 });
}

start();
