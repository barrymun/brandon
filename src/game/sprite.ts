import { Base } from "game/base";
import { Coords } from "utils";

export interface SpriteProps {
    position: Coords; 
};

export class Sprite extends Base {
    public readonly width: number = 50;
    
    public readonly height: number = 150;
    
    private position: Coords;

    public getPosition = (): Coords => this.position;

    private setPosition = (position: Coords): void => {
        this.position = position;
    };
    
    constructor({ position }: SpriteProps) {
        super();
        this.setPosition(position);
        this.bindListeners();
        console.log('Sprite loaded');
    };

    public draw = (): void => {
    };

    public udpate = (): void => {
        this.draw();
    };

    private handleUnload = (_event: Event) => {
        this.destroy();
    };

    private bindListeners = (): void => {
        window.addEventListener('unload', this.handleUnload);
    };

    public destroy = (): void => {
        window.removeEventListener('unload', this.handleUnload);
    };
};
