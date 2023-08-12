import { Base } from "game/base";
import { Coords, SpriteAnimation } from "utils";

interface BaseSpriteProps {
    position: Coords; 
    totalFrames?: number;
    scale?: number;
    heldFrames?: number;
    offset?: Coords;
    shouldFlip?: boolean;
};

type Sprites = {
    [key in SpriteAnimation]: {
        imageSrc: string;
        flippedImageSrc: string;
        totalFrames: number;
    };
};

type ImageSprites = {
    [key in SpriteAnimation]: {
        image: HTMLImageElement;
        flippedImage: HTMLImageElement;
        totalFrames: number;
    };
};

export type SpriteProps =
    | { imageSrc: string; sprites?: never; } & BaseSpriteProps
    | { sprites: Sprites; imageSrc?: never; } & BaseSpriteProps
;

export class Sprite extends Base {
    public readonly width: number = 50;
    
    public readonly height: number = 150;
    
    private position: Coords;

    public getPosition = (): Coords => this.position;

    protected setPosition = (position: Coords): void => {
        this.position = position;
    };

    private image: HTMLImageElement;

    public getImage = (): HTMLImageElement => this.image;

    protected setImage = (imageSrc: string): void => {
        const image = new Image();
        image.src = imageSrc;
        this.image = image;
    };

    private sprites: ImageSprites | undefined;

    public getSprites = (): ImageSprites => this.sprites;

    protected setSprites = (sprites: ImageSprites): void => {
        this.sprites = sprites;
    };

    private scale: number;

    public getScale = (): number => this.scale;

    private setScale = (scale: number): void => {
        this.scale = scale;
    };

    private totalFrames: number;

    public getTotalFrames = (): number => this.totalFrames;

    protected setTotalFrames = (totalFrames: number): void => {
        this.totalFrames = totalFrames;
    };

    private currentFrame: number = 0;

    public getCurrentFrame = (): number => this.currentFrame;

    protected setCurrentFrame = (currentFrame: number): void => {
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

    private offset: Coords;

    public getOffset = (): Coords => this.offset;

    private setOffset = (offset: Coords): void => {
        this.offset = offset;
    };

    private shouldFlip: boolean = false;

    public getShouldFlip = (): boolean => this.shouldFlip;

    public setShouldFlip = (shouldFlip: boolean): void => {
        this.shouldFlip = shouldFlip;
    }
    
    constructor({ 
        position, 
        imageSrc,
        sprites,
        scale = 1, 
        totalFrames = 1, 
        heldFrames = 5,
        offset = { x: 0, y: 0 },
        shouldFlip = false,
    }: SpriteProps) {
        super();
        this.setPosition(position);
        if (imageSrc) {
            this.setImage(imageSrc);
            this.setTotalFrames(totalFrames);
        } else {
            this.setSprites(
                Object.keys(sprites).reduce((previous, key: SpriteAnimation) => {
                    const image = new Image();
                    image.src = sprites[key].imageSrc;
                    const flippedImage = new Image();
                    flippedImage.src = sprites[key].flippedImageSrc;
                    return {
                      ...previous,
                      [key]: {
                        totalFrames: sprites[key].totalFrames,
                        image,
                        flippedImage,
                      }
                    };
                  }, {} as ImageSprites)
            );
            this.setImage(this.getSprites().idle[shouldFlip ? 'flippedImage' : 'image'].src);
            this.setTotalFrames(this.getSprites().idle.totalFrames);
        }
        this.setScale(scale);
        this.setHeldFrames(heldFrames);
        this.setOffset(offset);
        this.setShouldFlip(shouldFlip);
        console.log('Sprite loaded');
    };

    public draw = (): void => {
        this.getContext().drawImage(
            this.getImage(),
            this.getCurrentFrame() * this.getImage().width / this.getTotalFrames(),
            0,
            this.getImage().width / this.getTotalFrames(),
            this.getImage().height,
            this.getPosition().x - this.getOffset().x,
            this.getPosition().y - this.getOffset().y,
            this.getImage().width * this.getScale() / this.getTotalFrames(),
            this.getImage().height * this.getScale() ,
        );
    };

    protected animateFrames = (): void => {
        this.setElapsedFrames(this.getElapsedFrames() + 1);
        
        if (this.getElapsedFrames() % this.getHeldFrames() === 0) {
            if (this.getCurrentFrame() < this.getTotalFrames() - 1) {
                this.setCurrentFrame(this.getCurrentFrame() + 1);
            } else {
                this.setCurrentFrame(0);
            }
        }
    };

    public update = (): void => {
        this.draw();
        this.animateFrames();
    };
};
