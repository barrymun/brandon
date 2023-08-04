import { Sprite, SpriteProps } from "game";
import { Colour, Direction, enemyKeyBindings, playerKeyBindings } from "utils";

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
            directionFaced: Direction.Right,
        });
        this.setPlayer(player);
        
        const enemy: Sprite = this.createSprite({
            position: { x: 400, y: 100 },
            velocity: { x: 0, y: 0 },
            playerControlled: false,
            keyBindings: enemyKeyBindings,
            colour: Colour.Red,
            directionFaced: Direction.Left,
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

    private createSprite = (props: CreateSpriteProps): Sprite => {
        const sprite = new Sprite({ engine: this, ...props });
        sprite.draw();
        return sprite;
    };

    private detectSpriteCollision = (): void => {
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

    private detectWallCollision = (sprite: Sprite): void => {
        if (
            sprite.getPosition().x <= 0
            && sprite.getVelocity().x < 0
        ) {
            sprite.setVelocity({ x: 0, y: sprite.getVelocity().y });
        } else if (
            sprite.getPosition().x + sprite.width >= this.getCanvas().width
            && sprite.getVelocity().x > 0
        ) {
            sprite.setVelocity({ x: 0, y: sprite.getVelocity().y });
        }
    };

    private detectPlayerWallCollision = (): void => {
        this.detectWallCollision(this.getPlayer());
    };

    private detectEnemyWallCollision = (): void => {
        this.detectWallCollision(this.getEnemy());
    };

    private determineDirectionFaced = (): void => {
        if (this.getPlayer().getPosition().x < this.getEnemy().getPosition().x) {
            this.getPlayer().setDirectionFaced(Direction.Right);
            this.getEnemy().setDirectionFaced(Direction.Left);
        } else {
            this.getPlayer().setDirectionFaced(Direction.Left);
            this.getEnemy().setDirectionFaced(Direction.Right);
        }
    };

    public run = (): void => {
        requestAnimationFrame(this.run);

        this.getContext().fillStyle = Colour.Black;
        this.getContext().fillRect(0, 0, this.getCanvas().width, this.getCanvas().height);

        this.detectSpriteCollision();
        this.detectPlayerWallCollision();
        this.detectEnemyWallCollision();
        this.determineDirectionFaced();
        
        this.getPlayer().udpate();
        this.getEnemy().udpate();
    };

    private unloadListener = (_event: Event) => {
        this.unbindListeners();
    };

    private bindListeners = (): void => {
        window.addEventListener('unload', this.unloadListener);
        window.addEventListener('resize', this.setCanvasSize);
    };

    private unbindListeners = (): void => {
        window.removeEventListener('unload', this.unloadListener);
        window.removeEventListener('resize', this.setCanvasSize);
    };
};
