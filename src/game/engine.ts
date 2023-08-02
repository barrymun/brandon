import { Sprite, SpriteProps } from "game";
import { Colour, enemyKeyBindings, playerKeyBindings } from "utils";

type CreateSpriteProps = Omit<SpriteProps, 'engine'>;

export class Engine {
    private canvas: HTMLCanvasElement;

    public getCanvas = (): HTMLCanvasElement => this.canvas;

    private setCanvas = (canvas: HTMLCanvasElement): void => {
        this.canvas = canvas;
    };
    
    private context: CanvasRenderingContext2D;
    
    public getContext = (): CanvasRenderingContext2D => this.context;

    private setContext = (context: CanvasRenderingContext2D): void => {
        this.context = context;
    };

    private player: Sprite;

    public getPlayer = (): Sprite => this.player;

    private setPlayer = (player: Sprite): void => {
        this.player = player;
    };
    
    private enemy: Sprite;

    public getEnemy = (): Sprite => this.enemy;

    private setEnemy = (enemy: Sprite): void => {
        this.enemy = enemy;
    };
    
    constructor() {
        this.setCanvas(document.getElementById('c')! as HTMLCanvasElement);
        this.setContext(this.canvas.getContext('2d')!);
        this.setCanvasSize();
        
        const player: Sprite = this.createSprite({
            position: { x: 0, y: 0 },
            velocity: { x: 0, y: 0 },
            playerControlled: true,
            keyBindings: playerKeyBindings,
            colour: Colour.Green,
        });
        this.setPlayer(player);
        
        const enemy: Sprite = this.createSprite({
            position: { x: 400, y: 100 },
            velocity: { x: 0, y: 0 },
            playerControlled: false,
            keyBindings: enemyKeyBindings,
            colour: Colour.Red,
        });
        this.setEnemy(enemy);
        
        this.bindListeners();
        console.log('Engine loaded');
    };

    private setCanvasSize = (): void => {
        this.getCanvas().width = window.innerWidth;
        this.getCanvas().height = window.innerHeight;

        this.getContext().fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    private createSprite = ({ position, velocity, playerControlled, keyBindings, colour }: CreateSpriteProps): Sprite => {
        const sprite = new Sprite({ engine: this, position, velocity, playerControlled, keyBindings, colour });
        sprite.draw();
        return sprite;
    };

    private detectCollision = (): void => {
        if (
            this.getPlayer().getAttackBox().position.x + this.getPlayer().getAttackBox().width >= this.getEnemy().getPosition().x
            && this.getPlayer().getAttackBox().position.x <= this.getEnemy().getPosition().x + this.getEnemy().width
            && this.getPlayer().getAttackBox().position.y + this.getPlayer().getAttackBox().height >= this.getEnemy().getPosition().y
            && this.getPlayer().getAttackBox().position.y <= this.getEnemy().getPosition().y + this.getEnemy().height
            && this.getPlayer().getIsAttacking()
        ) {
            this.getPlayer().setIsAttacking(false);
            console.log('in range');
        }
    };

    public run = (): void => {
        requestAnimationFrame(this.run);

        this.getContext().fillStyle = Colour.Black;
        this.getContext().fillRect(0, 0, this.getCanvas().width, this.getCanvas().height);
        
        this.getPlayer().udpate();
        this.getEnemy().udpate();

        this.detectCollision();
    };

    private unloadListener = (_event: Event) => {
        this.unbindListeners();
    };

    private bindListeners = (): void => {
        window.addEventListener('unload', this.unloadListener);
    };

    private unbindListeners = (): void => {
        window.removeEventListener('unload', this.unloadListener);
    };
};
