import { Sprite, SpriteProps } from "game";
import { Colour, Direction, defaultTimer, enemyKeyBindings, playerKeyBindings } from "utils";

type CreateSpriteProps = Omit<SpriteProps, 'engine'>;

export class Engine {
    public readonly gameTimer = document.getElementById('game-timer')! as HTMLDivElement;
    
    public readonly playerHealth = document.getElementById('player-health')! as HTMLDivElement;
    
    public readonly enemyHealth = document.getElementById('enemy-health')! as HTMLDivElement;
    
    public readonly gameOverDialog = document.getElementById('game-over-dialog')! as HTMLDialogElement;
    
    public readonly gameOverTitle = document.getElementById('game-over-title')! as HTMLDivElement;
    
    public readonly gameOverBtn = document.getElementById('game-over-btn')! as HTMLButtonElement;

    private timer: number = defaultTimer;

    public getTimer = (): number => this.timer;

    private setTimer = (timer: number): void => {
        this.timer = timer;
    };

    private gameTimeout: ReturnType<typeof setTimeout>;

    public getGameTimeout = (): ReturnType<typeof setTimeout> => this.gameTimeout;

    private setGameTimeout = (gameTimeout: ReturnType<typeof setTimeout>): void => {
        this.gameTimeout = gameTimeout;
    };

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

        this.decreaseTimer();
        
        this.bindListeners();
        console.log('Engine loaded');
    };

    private decreaseTimer = (): void => {
        this.setGameTimeout(setTimeout(this.decreaseTimer, 1000));
        if (this.getTimer() > 0) {
            this.setTimer(this.getTimer() - 1);
            this.gameTimer.innerHTML = this.getTimer().toString();
        }
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

    private checkSpriteAttacked = ({ attacker, defender }: { attacker: Sprite; defender: Sprite; }): boolean => {
        if (
            attacker.getAttackBox().position.x + attacker.getAttackBox().width >= defender.getPosition().x
            && attacker.getAttackBox().position.x <= defender.getPosition().x + defender.width
            && attacker.getAttackBox().position.y + attacker.getAttackBox().height >= defender.getPosition().y
            && attacker.getAttackBox().position.y <= defender.getPosition().y + defender.height
            && attacker.getIsAttacking()
        ) {
            console.log('hit');
            defender.setHealth(defender.getHealth() - attacker.getDamage());
            attacker.setIsAttacking(false);
            return true;
        }
        return false;
    };

    private detectPlayerAttacking = (): void => {
        const wasAttacked = this.checkSpriteAttacked({
            attacker: this.getPlayer(),
            defender: this.getEnemy(),
        });
        if (wasAttacked) {
            const damageTaken: number = 100 - this.getEnemy().getHealth();
            Object.assign(this.enemyHealth.style, { width: `calc(100% - ${damageTaken}%)` });
        }
    };

    private detectEnemyAttacking = (): void => {
        const wasAttacked = this.checkSpriteAttacked({
            attacker: this.getEnemy(),
            defender: this.getPlayer(),
        });
        if (wasAttacked) {
            const damageTaken: number = 100 - this.getPlayer().getHealth();
            Object.assign(this.playerHealth.style, { width: `calc(100% - ${damageTaken}%)` });
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

    private checkGameOver = (): void => {
        let gameOver: boolean = false;
        
        if (this.getPlayer().getHealth() <= 0) {
            this.gameOverTitle.innerHTML = 'Game over, you lose!';
            gameOver = true;
        } else if (this.getEnemy().getHealth() <= 0) {
            this.gameOverTitle.innerHTML = 'Game over, you win!';
            gameOver = true;
        }

        if (this.getTimer() <= 0) {
            this.gameOverTitle.innerHTML = 'Draw, time is up!';
            gameOver = true;
        }

        if (gameOver) {
            this.endGame();
        }
    };

    private endGame = (): void => {
        this.gameOverDialog.close(); // ensure closed before re-opening otherwise error will be thrown
        this.gameOverDialog.showModal();
        clearTimeout(this.getGameTimeout());
        this.getPlayer().destroy();
        this.getEnemy().destroy();
    };

    public run = (): void => {
        requestAnimationFrame(this.run);

        this.getContext().fillStyle = Colour.Black;
        this.getContext().fillRect(0, 0, this.getCanvas().width, this.getCanvas().height);

        this.detectPlayerAttacking();
        this.detectEnemyAttacking();
        this.detectPlayerWallCollision();
        this.detectEnemyWallCollision();
        this.determineDirectionFaced();
        
        this.getPlayer().udpate();
        this.getEnemy().udpate();

        this.checkGameOver();
    };

    private handleGameOverBtnClick = (): void => {
        this.destroy();
        window.location.reload();
    };

    private handleUnload = (_event: Event) => {
        this.destroy();
    };

    private bindListeners = (): void => {
        this.gameOverBtn.addEventListener('click', this.handleGameOverBtnClick);
        
        window.addEventListener('resize', this.setCanvasSize);
        window.addEventListener('unload', this.handleUnload);
    };

    private destroy = (): void => {
        this.gameOverBtn.removeEventListener('click', this.handleGameOverBtnClick);
        
        window.removeEventListener('resize', this.setCanvasSize);
        window.removeEventListener('unload', this.handleUnload);
    };
};
