import { Engine } from 'game/engine';

import 'assets/index.css';

let engine: Engine;

function start(): void {
    engine = new Engine();
    engine.run();
}

start();
