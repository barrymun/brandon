import { Game } from "src/game";

export abstract class Base {
    private game: Game;

    protected getGame = (): Game => this.game;

    private setGame = (game: Game): void => {
        this.game = game;
    };

    constructor(game: Game) {
        this.setGame(game);
    }
};
