import { Base } from "game/base";
import { Coords } from "utils";

export interface SpriteProps {
    position: Coords; 
    imageSrc: string;
    scale?: number;
    totalFrames?: number;
    heldFrames?: number;
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

    private scale: number;

    public getScale = (): number => this.scale;

    private setScale = (scale: number): void => {
        this.scale = scale;
    };

    private totalFrames: number;

    public getTotalFrames = (): number => this.totalFrames;

    private setTotalFrames = (totalFrames: number): void => {
        this.totalFrames = totalFrames;
    };

    private currentFrame: number = 0;

    public getCurrentFrame = (): number => this.currentFrame;

    private setCurrentFrame = (currentFrame: number): void => {
        this.currentFrame = currentFrame;
    };

    private elapsedFrames: number = 0;

    public getElapsedFrames = (): number => this.elapsedFrames;

    private setElapsedFrames = (elapsedFrames: number): void => {
        this.elapsedFrames = elapsedFrames;
    };

    private heldFrames: number;

    public getHeldFrames = (): number => this.heldFrames;

    private setHeldFrames = (heldFrames: number): void => {
        this.heldFrames = heldFrames;
    };
    
    constructor({ position, imageSrc, scale = 1, totalFrames = 1, heldFrames = 5 }: SpriteProps) {
        super();
        this.setPosition(position);
        this.setImage(imageSrc);
        this.setScale(scale);
        this.setTotalFrames(totalFrames);
        this.setHeldFrames(heldFrames);
        this.bindListeners();
        console.log('Sprite loaded');
    };

    public draw = (): void => {
        this.getContext().drawImage(
            this.getImage(),
            this.getCurrentFrame() * this.getImage().width / this.getTotalFrames(),
            0,
            this.getImage().width / this.getTotalFrames(),
            this.getImage().height,
            this.getPosition().x,
            this.getPosition().y,
            this.getImage().width * this.getScale() / this.getTotalFrames(),
            this.getImage().height * this.getScale() ,
        );
    };

    public update = (): void => {
        this.draw();

        this.setElapsedFrames(this.getElapsedFrames() + 1);
        
        if (this.getElapsedFrames() % this.getHeldFrames() === 0) {
            if (this.getCurrentFrame() < this.getTotalFrames() - 1) {
                this.setCurrentFrame(this.getCurrentFrame() + 1);
            } else {
                this.setCurrentFrame(0);
            }
        }
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
