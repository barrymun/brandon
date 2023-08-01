import { Engine } from "game";

export abstract class Base {
    private engine: Engine;

    protected getEngine = (): Engine => this.engine;

    private setEngine = (engine: Engine): void => {
        this.engine = engine;
    };

    constructor(engine: Engine) {
        this.setEngine(engine);
    }
};
