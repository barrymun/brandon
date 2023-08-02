import { Engine } from "game";

let engine: Engine;

function start(): void {
    engine = new Engine();
    engine.run();
}

start();
