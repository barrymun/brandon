import { Sprite, SpriteProps } from "game/sprite";
import { 
    AttackBox, 
    AttackBoxDimensions, 
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
    attackBoxDimensions: AttackBoxDimensions;
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
    public readonly width: number = 100;
    
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
        position: this.getPosition(),
    };

    public getAttackBox = (): AttackBox => this.attackBox;

    private setAttackBox = (attackBox: AttackBox): void => {
        this.attackBox = attackBox;
    };

    private attackBoxDimensions: AttackBoxDimensions = {
        offset: { x: 0, y: 0 },
        width: this.attackBoxWidth,
        height: this.attackBoxHeight,
    };

    public getAttackBoxOffset = (): AttackBoxDimensions => this.attackBoxDimensions;

    private setAttackBoxOffset = (attackBoxDimensions: AttackBoxDimensions): void => {
        this.attackBoxDimensions = attackBoxDimensions;
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

    public getDirectionFaced = (): DirectionFaced => this.directionFaced;

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

    private isDead: boolean = false;

    public getIsDead = (): boolean => this.isDead;

    private setIsDead = (isDead: boolean): void => {
        this.isDead = isDead;
    };
    
    constructor({ velocity, keyBindings, directionFaced, attackBoxDimensions, ...spriteProps }: FighterProps) {
        super(spriteProps);
        this.setVelocity(velocity);
        this.setKeyBindings(keyBindings);
        this.setDirectionFaced(directionFaced);
        this.setAttackBoxOffset(attackBoxDimensions);
        this.bindListeners();
        console.log('Fighter loaded');
    };

    private isJumping = (): boolean => this.getVelocity().y < 0;
    
    private isFalling = (): boolean => this.getVelocity().y > 0;

    private isDying = (): boolean => this.getHealth() <= 0;

    private switchSpriteState = (state: SpriteAnimation): void => {
        // don't switch if dying
        if (this.getImage().src === this.getSprites().die[this.getShouldFlip() ? 'flippedImage' : 'image'].src) {
            if (this.getCurrentFrame() === this.getSprites().die.totalFrames - 1) {
                this.setIsDead(true);
            }
            return;
        }
        
        // don't switch if attack animation is still playing
        if (this.getImage().src === this.getSprites().attack[this.getShouldFlip() ? 'flippedImage' : 'image'].src
            && this.getCurrentFrame() < this.getSprites().attack.totalFrames - 1) {
            return;
        }

        // don't switch if take hit animation is still playing
        if (this.getImage().src === this.getSprites().takeHit[this.getShouldFlip() ? 'flippedImage' : 'image'].src
            && this.getCurrentFrame() < this.getSprites().takeHit.totalFrames - 1) {
            return;
        }

        switch (state) {
            case 'idle':
                if (this.getImage().src !== this.getSprites().idle[this.getShouldFlip() ? 'flippedImage' : 'image'].src) {
                    this.setImage(this.getSprites().idle[this.getShouldFlip() ? 'flippedImage' : 'image'].src);
                    this.setTotalFrames(this.getSprites().idle.totalFrames);
                    // not resetting current frame here because it's not necessary
                }
                break;
            case 'run':
                if (this.getImage().src !== this.getSprites().run[this.getShouldFlip() ? 'flippedImage' : 'image'].src) {
                    this.setImage(this.getSprites().run[this.getShouldFlip() ? 'flippedImage' : 'image'].src);
                    this.setTotalFrames(this.getSprites().run.totalFrames);
                    // not resetting current frame here because it's not necessary
                }
                break;
            case 'attack':
                if (this.getImage().src !== this.getSprites().attack[this.getShouldFlip() ? 'flippedImage' : 'image'].src) {
                    this.setImage(this.getSprites().attack[this.getShouldFlip() ? 'flippedImage' : 'image'].src);
                    this.setTotalFrames(this.getSprites().attack.totalFrames);
                    this.setCurrentFrame(0);
                }
                break;
            case 'fall':
                if (this.getImage().src !== this.getSprites().fall[this.getShouldFlip() ? 'flippedImage' : 'image'].src) {
                    this.setImage(this.getSprites().fall[this.getShouldFlip() ? 'flippedImage' : 'image'].src);
                    this.setTotalFrames(this.getSprites().fall.totalFrames);
                    this.setCurrentFrame(0);
                }
                break;
            case 'jump':
                if (this.getImage().src !== this.getSprites().jump[this.getShouldFlip() ? 'flippedImage' : 'image'].src) {
                    this.setImage(this.getSprites().jump[this.getShouldFlip() ? 'flippedImage' : 'image'].src);
                    this.setTotalFrames(this.getSprites().jump.totalFrames);
                    this.setCurrentFrame(0);
                }
                break;
            case 'takeHit':
                if (this.getImage().src !== this.getSprites().takeHit[this.getShouldFlip() ? 'flippedImage' : 'image'].src) {
                    this.setImage(this.getSprites().takeHit[this.getShouldFlip() ? 'flippedImage' : 'image'].src);
                    this.setTotalFrames(this.getSprites().takeHit.totalFrames);
                    this.setCurrentFrame(0);
                }
                break;
            case 'die':
                if (this.getImage().src !== this.getSprites().die[this.getShouldFlip() ? 'flippedImage' : 'image'].src) {
                    this.setImage(this.getSprites().die[this.getShouldFlip() ? 'flippedImage' : 'image'].src);
                    this.setTotalFrames(this.getSprites().die.totalFrames);
                    this.setCurrentFrame(0);
                }
                break;
            default:
                break;
        }
    };

    private attack(): void {
        this.setIsAttacking(true);
        this.switchSpriteState('attack');
    };

    public takeHit = (damage: number): void => {
        this.setHealth(this.getHealth() - damage);

        if (this.isDying()) {
            this.switchSpriteState('die');
        } else {
            this.switchSpriteState('takeHit');
        }
    };

    private handleGravity = (): void => {
        if (this.getPosition().y + this.height + this.getVelocity().y 
            >= this.canvas.height - groundOffset) {
            this.setVelocity({ ...this.getVelocity(), y: 0 });
        } else {
            this.setVelocity({ ...this.getVelocity(), y: this.getVelocity().y + this.gravity });
        }
    };

    private handleMovementVelocity = (): void => {
        if (this.isDying()) {
            return;
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

    public update = (): void => {
        this.draw();

        if (!this.getIsDead()) {
            this.animateFrames();
        }
        
        this.setPosition({
            ...this.getPosition(),
            x: this.getPosition().x + this.getVelocity().x,
            y: this.getPosition().y + this.getVelocity().y,
        });
        this.setAttackBox({
            position: {
                ...this.getPosition(),
                x: this.getDirectionFaced() === Direction.Right 
                    ? this.getPosition().x + this.getAttackBoxOffset().offset.x
                    : this.getPosition().x - this.width - this.getAttackBoxOffset().offset.x,
                y: this.getPosition().y + (this.height / 3),
            },
        });
        
        // attack box rect for debugging
        // this.getContext().fillRect(
        //     this.getAttackBox().position.x,
        //     this.getAttackBox().position.y,
        //     this.getAttackBoxOffset().width,
        //     this.getAttackBoxOffset().height,
        // );

        this.handleGravity();

        // unset horizontal velocity (handle no keys pressed)
        this.setVelocity({ ...this.getVelocity(), x: 0 });

        if (this.isJumping()) {
            this.switchSpriteState('jump');
        } else if (this.isFalling()) {
            this.switchSpriteState('fall');
        } else {
            this.switchSpriteState('idle');
        }
        
        this.handleMovementVelocity();
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
