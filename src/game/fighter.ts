import { Sprite, SpriteProps } from "game/sprite";
import { 
    AttackBox, 
    Colour, 
    Coords, 
    Direction, 
    DirectionFaced, 
    KeyBindings, 
    SpriteAnimation, 
    defaultAttackDamage, 
    defaultHealth,
    groundOffset, 
} from "utils";

export type FighterProps = {
    velocity: Coords; 
    keyBindings: KeyBindings;
    directionFaced: DirectionFaced;
} & SpriteProps;

export interface Keys {
    left: {
        pressed: boolean;
    },
    right: {
        pressed: boolean;
    },
    jump: {
        pressed: boolean,
    },
}

export class Fighter extends Sprite {
    public readonly width: number = 50;
    
    public readonly height: number = 150;
    
    public readonly attackBoxWidth: number = 100;
    
    public readonly attackBoxHeight: number = 50;
    
    public readonly gravity: number = 0.6;

    public readonly moveSpeed: number = 5;

    public readonly jumpHeight: number = 15;

    private keyBindings: KeyBindings;

    public getKeyBindings = (): KeyBindings => this.keyBindings;

    private setKeyBindings = (keyBindings: KeyBindings): void => {
        this.keyBindings = keyBindings;
    };

    private keys: Keys = {
        left: {
            pressed: false,
        },
        right: {
            pressed: false,
        },
        jump: {
            pressed: false,
        },
    };

    public getKeys = (): Keys => this.keys;

    private setKeys = (keys: Keys): void => {
        this.keys = keys;
    };

    private attackBox: AttackBox = {
        width: this.attackBoxWidth,
        height: this.attackBoxHeight,
        position: this.getPosition(),
    };

    public getAttackBox = (): AttackBox => this.attackBox;

    private setAttackBox = (attackBox: AttackBox): void => {
        this.attackBox = attackBox;
    };
    
    private velocity: Coords;

    public getVelocity = (): Coords => this.velocity;

    public setVelocity = (velocity: Coords): void => {
        this.velocity = velocity;
    };

    private isAttacking: boolean = false;

    public getIsAttacking = (): boolean => this.isAttacking;

    public setIsAttacking = (isAttacking: boolean): void => {
        this.isAttacking = isAttacking;
    };
    
    private directionFaced: DirectionFaced;

    public getDirerectionFaced = (): DirectionFaced => this.directionFaced;

    public setDirectionFaced = (directionFaced: DirectionFaced): void => {
        this.directionFaced = directionFaced;
    };

    private health: number = defaultHealth;

    public getHealth = (): number => this.health;

    public setHealth = (health: number): void => {
        this.health = health;
    };

    private attackDamage: number = defaultAttackDamage;

    public getDamage = (): number => this.attackDamage;

    public setDamage = (attackDamage: number): void => {
        this.attackDamage = attackDamage;
    };
    
    constructor({ velocity, keyBindings, directionFaced, ...spriteProps }: FighterProps) {
        super(spriteProps);
        this.setVelocity(velocity);
        this.setKeyBindings(keyBindings);
        this.setDirectionFaced(directionFaced);
        this.bindListeners();
        console.log('Fighter loaded');
    };

    private isJumping = (): boolean => this.getVelocity().y < 0;
    
    private isFalling = (): boolean => this.getVelocity().y > 0;

    private switchSpriteState = (state: SpriteAnimation): void => {
        if (this.getImage().src === this.getSprites().attack.image.src
            && this.getCurrentFrame() < this.getSprites().attack.totalFrames - 1) {
            return;
        }

        switch (state) {
            case 'attack':
                if (this.getImage().src !== this.getSprites().attack.image.src) {
                    this.setImage(this.getSprites().attack.image.src);
                    this.setTotalFrames(this.getSprites().attack.totalFrames);
                    this.setCurrentFrame(0);
                }
                break;
            case 'fall':
                if (this.getImage().src !== this.getSprites().fall.image.src) {
                    this.setImage(this.getSprites().fall.image.src);
                    this.setTotalFrames(this.getSprites().fall.totalFrames);
                    this.setCurrentFrame(0);
                }
                break;
            case 'idle':
                if (this.getImage().src !== this.getSprites().idle.image.src) {
                    this.setImage(this.getSprites().idle.image.src);
                    this.setTotalFrames(this.getSprites().idle.totalFrames);
                    // not resetting current frame here because it's not necessary
                }
                break;
            case 'jump':
                if (this.getImage().src !== this.getSprites().jump.image.src) {
                    this.setImage(this.getSprites().jump.image.src);
                    this.setTotalFrames(this.getSprites().jump.totalFrames);
                    this.setCurrentFrame(0);
                }
                break;
            case 'run':
                if (this.getImage().src !== this.getSprites().run.image.src) {
                    this.setImage(this.getSprites().run.image.src);
                    this.setTotalFrames(this.getSprites().run.totalFrames);
                    // not resetting current frame here because it's not necessary
                }
                break;
            default:
                break;
        }
    };

    public update = (): void => {
        this.draw();

        this.animateFrames();
        
        this.setPosition({
            ...this.getPosition(),
            x: this.getPosition().x + this.getVelocity().x,
            y: this.getPosition().y + this.getVelocity().y,
        });
        this.setAttackBox({
            width: this.attackBoxWidth,
            height: this.attackBoxHeight,
            position: {
                ...this.getPosition(),
                x: this.getDirerectionFaced() === Direction.Right 
                    ? this.getPosition().x 
                    : this.getPosition().x + this.width - this.attackBoxWidth,
            },
        });

        // handle gravity
        if (this.getPosition().y + this.height + this.getVelocity().y 
            >= this.canvas.height - groundOffset) {
            this.setVelocity({ ...this.getVelocity(), y: 0 });
        } else {
            this.setVelocity({ ...this.getVelocity(), y: this.getVelocity().y + this.gravity });
        }

        // unset velocity (handle no keys pressed)
        this.setVelocity({ ...this.getVelocity(), x: 0 });

        if (this.isJumping()) {
            this.switchSpriteState('jump');
        } else if (this.isFalling()) {
            this.switchSpriteState('fall');
        } else {
            this.switchSpriteState('idle');
        }
        
        if (this.getKeys().right.pressed && !this.getKeys().left.pressed) {
            this.setVelocity({ ...this.getVelocity(), x: this.moveSpeed });
            if (!this.isJumping() && !this.isFalling()) {
                this.switchSpriteState('run');
            }
        }
        if (this.getKeys().left.pressed && !this.getKeys().right.pressed) {
            this.setVelocity({ ...this.getVelocity(), x: -this.moveSpeed });
            if (!this.isJumping() && !this.isFalling()) {
                this.switchSpriteState('run');
            }
        }
        if (this.getKeys().jump.pressed && this.getVelocity().y === 0) {
            this.setVelocity({ ...this.getVelocity(), y: -this.jumpHeight });
        }
    };

    private attack(): void {
        this.setIsAttacking(true);
        
        this.switchSpriteState('attack');
        
        setTimeout(() => {
            this.setIsAttacking(false);
        }, 100);
    };

    private handleKeydown = (event: KeyboardEvent) => {
        switch (event.key) {
            case this.getKeyBindings().right:
                this.setKeys({ ...this.getKeys(), right: { pressed: true } });
                break;
            case this.getKeyBindings().left:
                this.setKeys({ ...this.getKeys(), left: { pressed: true } });
                break;
            case this.getKeyBindings().jump:
                this.setKeys({ ...this.getKeys(), jump: { pressed: true } });
                break;
            case this.getKeyBindings().attack:
                this.attack();
            default:
                break;
        }
    };

    private handleKeyup = (event: KeyboardEvent) => {
        switch (event.key) {
            case this.getKeyBindings().right:
                this.setKeys({ ...this.getKeys(), right: { pressed: false } });
                break;
            case this.getKeyBindings().left:
                this.setKeys({ ...this.getKeys(), left: { pressed: false } });
                break;
            case this.getKeyBindings().jump:
                this.setKeys({ ...this.getKeys(), jump: { pressed: false } });
                break;
            default:
                break;
        }
    };

    private handleUnload = (_event: Event) => {
        this.destroy();
    };

    private bindListeners = (): void => {
        window.addEventListener('keydown', this.handleKeydown);
        window.addEventListener('keyup', this.handleKeyup);
        window.addEventListener('unload', this.handleUnload);
    };

    public destroy = (): void => {
        window.removeEventListener('keydown', this.handleKeydown);
        window.removeEventListener('keyup', this.handleKeyup);
        window.removeEventListener('unload', this.handleUnload);
    };
};
