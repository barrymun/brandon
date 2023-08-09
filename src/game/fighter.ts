import { Base } from "game/base";
import { 
    AttackBox, 
    Colour, 
    Coords, 
    Direction, 
    DirectionFaced, 
    KeyBindings, 
    defaultAttackDamage, 
    defaultHealth,
    groundOffset, 
} from "utils";

export interface FighterProps {
    position: Coords; 
    velocity: Coords; 
    keyBindings: KeyBindings;
    colour: Colour;
    directionFaced: DirectionFaced;
};

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

export class Fighter extends Base {
    public readonly width: number = 50;
    
    public readonly height: number = 150;
    
    public readonly attackBoxWidth: number = 100;
    
    public readonly attackBoxHeight: number = 50;
    
    public readonly gravity: number = 0.7;

    public readonly moveSpeed: number = 5;

    public readonly jumpHeight: number = 20;

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
    
    private position: Coords;

    public getPosition = (): Coords => this.position;

    private setPosition = (position: Coords): void => {
        this.position = position;
        this.setAttackBox({
            width: this.attackBoxWidth,
            height: this.attackBoxHeight,
            position: {
                ...position,
                x: this.getDirerectionFaced() === Direction.Right 
                    ? position.x 
                    : position.x + this.width - this.attackBoxWidth,
            },
        });
    };

    private attackBox: AttackBox;

    public getAttackBox = (): AttackBox => this.attackBox;

    private setAttackBox = (attackBox: AttackBox): void => {
        this.attackBox = attackBox;
    };
    
    private velocity: Coords;

    public getVelocity = (): Coords => this.velocity;

    public setVelocity = (velocity: Coords): void => {
        this.velocity = velocity;
    };

    private colour: Colour;

    public getColour = (): Colour => this.colour;

    private setColour = (colour: Colour): void => {
        this.colour = colour;
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
    
    constructor({ position, velocity, keyBindings, colour, directionFaced }: FighterProps) {
        super();
        this.setPosition(position);
        this.setVelocity(velocity);
        this.setKeyBindings(keyBindings);
        this.setColour(colour);
        this.setDirectionFaced(directionFaced);
        this.bindListeners();
        console.log('Fighter loaded');
    };

    public draw = (): void => {
        this.getContext().fillStyle = this.getColour();
        this.getContext()
            .fillRect(
                this.getPosition().x, 
                this.getPosition().y, 
                this.width, 
                this.height
            );
        
        if (this.getIsAttacking()) {
            this.getContext().fillStyle = Colour.Blue;
            this.getContext()
                .fillRect(
                    this.getAttackBox().position.x, 
                    this.getAttackBox().position.y, 
                    this.getAttackBox().width, 
                    this.getAttackBox().height
                );
        }
    };

    public update = (): void => {
        this.draw();
        
        this.setPosition({
            ...this.getPosition(),
            x: this.getPosition().x + this.getVelocity().x,
            y: this.getPosition().y + this.getVelocity().y,
        });

        if (this.getPosition().y + this.height + this.getVelocity().y >= 
            this.canvas.height - groundOffset) {
            this.setVelocity({ ...this.getVelocity(), y: 0 });
        } else {
            this.setVelocity({ ...this.getVelocity(), y: this.getVelocity().y + this.gravity });
        }

        // unset velocity (handle no keys pressed)
        this.setVelocity({ ...this.getVelocity(), x: 0 });
        
        if (this.getKeys().right.pressed && !this.getKeys().left.pressed) {
            this.setVelocity({ ...this.getVelocity(), x: this.moveSpeed });
        }
        if (this.getKeys().left.pressed && !this.getKeys().right.pressed) {
            this.setVelocity({ ...this.getVelocity(), x: -this.moveSpeed });
        }
        if (this.getKeys().jump.pressed && this.getVelocity().y === 0) {
            this.setVelocity({ ...this.getVelocity(), y: -this.jumpHeight });
        }
    };

    private attack(): void {
        this.setIsAttacking(true);
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
