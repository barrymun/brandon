import { Coords } from "src/constants";
import { Base, Game } from "src/game";

export class Sprite extends Base {
    private readonly width: number = 50;
    
    private readonly height: number = 150;
    
    private readonly gravity: number = 0.2;
    
    private position: Coords;

    public getPosition = (): Coords => this.position;

    private setPosition = (position: Coords): void => {
        this.position = position;
    };
    
    private velocity: Coords;

    public getVelocity = (): Coords => this.velocity;

    private setVelocity = (velocity: Coords): void => {
        this.velocity = velocity;
    };
    
    constructor({ game, position, velocity }: { game: Game, position: Coords, velocity: Coords }) {
        super(game);
        this.setPosition(position);
        this.setVelocity(velocity);
        console.log('Sprite loaded');
    };

    public draw = (): void => {
        this.getGame().getContext().fillStyle = 'red';
        this.getGame()
            .getContext()
            .fillRect(this.getPosition().x, this.getPosition().y, this.width, this.height);
    };

    public udpate = (): void => {
        this.draw();
        
        this.setPosition({
            ...this.getPosition(),
            y: this.getPosition().y + this.getVelocity().y,
        });

        if (this.getPosition().y + this.height + this.getVelocity().y >= this.getGame().getCanvas().height) {
            this.setVelocity({ ...this.getVelocity(), y: 0 });
        } else {
            this.setVelocity({ ...this.getVelocity(), y: this.getVelocity().y + this.gravity });
        }
    };
};