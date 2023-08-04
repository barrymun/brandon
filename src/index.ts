import { Engine } from "game";

import 'assets/index.css';

let engine: Engine;

function start(): void {
    engine = new Engine();
    engine.run();
}

start();
