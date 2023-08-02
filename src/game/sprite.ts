import { Base, Engine } from "game";
import { Coords, KeyBindings } from "utils";

export interface SpriteProps {
    engine: Engine; 
    position: Coords; 
    velocity: Coords; 
    playerControlled: boolean;
    keyBindings: KeyBindings;
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

export class Sprite extends Base {
    private readonly width: number = 50;
    
    private readonly height: number = 150;
    
    private readonly gravity: number = 0.2;

    private readonly moveSpeed: number = 5;

    private readonly jumpHeight: number = 10;

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
    };
    
    private velocity: Coords;

    public getVelocity = (): Coords => this.velocity;

    private setVelocity = (velocity: Coords): void => {
        this.velocity = velocity;
    };

    private playerControlled: boolean;

    public getPlayerControlled = (): boolean => this.playerControlled;

    private setPlayerControlled = (playerControlled: boolean): void => {
        this.playerControlled = playerControlled;
    };
    
    constructor({ engine, position, velocity, playerControlled, keyBindings }: SpriteProps) {
        super(engine);
        this.setPosition(position);
        this.setVelocity(velocity);
        this.setPlayerControlled(playerControlled);
        this.setKeyBindings(keyBindings);
        this.bindListeners();
        console.log('Sprite loaded');
    };

    public draw = (): void => {
        this.getEngine().getContext().fillStyle = 'red';
        this.getEngine()
            .getContext()
            .fillRect(this.getPosition().x, this.getPosition().y, this.width, this.height);
    };

    public udpate = (): void => {
        this.draw();
        
        this.setPosition({
            ...this.getPosition(),
            x: this.getPosition().x + this.getVelocity().x,
            y: this.getPosition().y + this.getVelocity().y,
        });

        if (this.getPosition().y + this.height + this.getVelocity().y >= this.getEngine().getCanvas().height) {
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

    private handleKeydown = (event: KeyboardEvent) => {
        // if (!this.getPlayerControlled()) return;
        
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
            default:
                break;
        }
    };

    private handleKeyup = (event: KeyboardEvent) => {
        // if (!this.getPlayerControlled()) return;
        
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

    private unloadListener = (_event: Event) => {
        this.unbindListeners();
    };

    private bindListeners = (): void => {
        window.addEventListener('keydown', this.handleKeydown);
        window.addEventListener('keyup', this.handleKeyup);
        window.addEventListener('unload', this.unloadListener);
    };

    private unbindListeners = (): void => {
        window.removeEventListener('keydown', this.handleKeydown);
        window.removeEventListener('keyup', this.handleKeyup);
        window.removeEventListener('unload', this.unloadListener);
    };
};
