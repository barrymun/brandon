import { Base } from "game/base";
import { Coords } from "utils";

export interface SpriteProps {
    position: Coords; 
    imageSrc: string;
};

export class Sprite extends Base {
    public readonly width: number = 50;
    
    public readonly height: number = 150;
    
    private position: Coords;

    public getPosition = (): Coords => this.position;

    private setPosition = (position: Coords): void => {
        this.position = position;
    };

    private image: HTMLImageElement;

    public getImage = (): HTMLImageElement => this.image;

    private setImage = (imageSrc: string): void => {
        const image = new Image();
        image.src = imageSrc;
        this.image = image;
    };
    
    constructor({ position, imageSrc }: SpriteProps) {
        super();
        this.setPosition(position);
        this.setImage(imageSrc);
        this.bindListeners();
        console.log('Sprite loaded');
    };

    public draw = (): void => {
        this.getContext().drawImage(
            this.getImage(),
            this.getPosition().x,
            this.getPosition().y,
        );
    };

    public update = (): void => {
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
