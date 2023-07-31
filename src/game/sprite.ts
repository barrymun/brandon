import { Coords } from "src/constants";
import { Base, Game } from "src/game";

export interface SpriteProps {
    game: Game; 
    position: Coords; 
    velocity: Coords; 
    playerControlled: boolean;
};

export interface Keys {
    a: {
        pressed: boolean;
    },
    d: {
        pressed: boolean;
    },
    w: {
        pressed: boolean,
    },
}

export class Sprite extends Base {
    private readonly width: number = 50;
    
    private readonly height: number = 150;
    
    private readonly gravity: number = 0.2;

    private keys: Keys = {
        a: {
            pressed: false,
        },
        d: {
            pressed: false,
        },
        w: {
            pressed: false,
        },
    };

    public getKeys = (): Keys => this.keys;

    private setKeys = (keys: Keys): void => {
        this.keys = keys;
    };

    private lastKey: KeyboardEvent['key'];

    public getLastKey = (): KeyboardEvent['key'] => this.lastKey;

    private setLastKey = (lastKey: KeyboardEvent['key']): void => {
        this.lastKey = lastKey;
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
    
    constructor({ game, position, velocity, playerControlled }: SpriteProps) {
        super(game);
        this.setPosition(position);
        this.setVelocity(velocity);
        this.setPlayerControlled(playerControlled);
        this.bindListeners();
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
            x: this.getPosition().x + this.getVelocity().x,
            y: this.getPosition().y + this.getVelocity().y,
        });

        if (this.getPosition().y + this.height + this.getVelocity().y >= this.getGame().getCanvas().height) {
            this.setVelocity({ ...this.getVelocity(), y: 0 });
        } else {
            this.setVelocity({ ...this.getVelocity(), y: this.getVelocity().y + this.gravity });
        }

        // unset velocity (handle no keys pressed)
        this.setVelocity({ ...this.getVelocity(), x: 0 });
        
        if (this.getKeys().d.pressed && this.getLastKey() === 'd') {
            this.setVelocity({ ...this.getVelocity(), x: 1 });
        } else if (this.getKeys().a.pressed && this.getLastKey() === 'a') {
            this.setVelocity({ ...this.getVelocity(), x: -1 });
        }
    };

    private handleKeydown = (event: KeyboardEvent) => {
        if (!this.getPlayerControlled()) return;
        
        switch (event.key) {
            case 'd':
                this.setKeys({ ...this.getKeys(), d: { pressed: true } });
                this.setLastKey('d');
                break;
            case 'a':
                this.setKeys({ ...this.getKeys(), a: { pressed: true } });
                this.setLastKey('a');
                break;
            case 'w':
                this.setVelocity({ ...this.getVelocity(), y: -10 });
                break;
            default:
                break;
        }
    };

    private handleKeyup = (event: KeyboardEvent) => {
        if (!this.getPlayerControlled()) return;
        
        switch (event.key) {
            case 'd':
                this.setKeys({ ...this.getKeys(), d: { pressed: false } });
            case 'a':
                this.setKeys({ ...this.getKeys(), a: { pressed: false } });
            case 'w':
                this.setKeys({ ...this.getKeys(), w: { pressed: false } });
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
