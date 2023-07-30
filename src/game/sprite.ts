import { Position } from "src/constants";
import { Base, Game } from "src/game";

export class Sprite extends Base {
    private position: Position;

    public getPosition = (): Position => this.position;

    private setPosition = (position: Position): void => {
        this.position = position;
    };
    
    constructor({ game, position }: { game: Game, position: Position}) {
        super(game);
        this.setPosition(position);
        console.log('Sprite loaded');
    };

    public draw = (): void => {
        this.getGame().getContext().fillStyle = 'red';
        this.getGame().getContext().fillRect(this.getPosition().x, this.getPosition().y, 100, 100);
    };
};