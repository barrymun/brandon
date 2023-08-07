import { Fighter, FighterProps } from "game";
import { Colour, Direction, defaultTimer, enemyKeyBindings, playerKeyBindings } from "utils";

type CreateFighterProps = Omit<FighterProps, 'engine'>;

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

    private player: Fighter;

    public getPlayer = (): Fighter => this.player;

    private setPlayer = (player: Fighter): void => {
        this.player = player;
    };
    
    private enemy: Fighter;

    public getEnemy = (): Fighter => this.enemy;

    private setEnemy = (enemy: Fighter): void => {
        this.enemy = enemy;
    };
    
    constructor() {
        this.setCanvas(document.getElementById('c')! as HTMLCanvasElement);
        this.setContext(this.canvas.getContext('2d')!);
        this.setCanvasSize();
        
        const player: Fighter = this.createFighter({
            position: { x: 0, y: 0 },
            velocity: { x: 0, y: 0 },
            playerControlled: true,
            keyBindings: playerKeyBindings,
            colour: Colour.Green,
            directionFaced: Direction.Right,
        });
        this.setPlayer(player);
        
        const enemy: Fighter = this.createFighter({
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

    private createFighter = (props: CreateFighterProps): Fighter => {
        const fighter = new Fighter({ engine: this, ...props });
        fighter.draw();
        return fighter;
    };

    private checkFighterAttacked = ({ attacker, defender }: { attacker: Fighter; defender: Fighter; }): boolean => {
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
        const wasAttacked = this.checkFighterAttacked({
            attacker: this.getPlayer(),
            defender: this.getEnemy(),
        });
        if (wasAttacked) {
            const damageTaken: number = 100 - this.getEnemy().getHealth();
            Object.assign(this.enemyHealth.style, { width: `calc(100% - ${damageTaken}%)` });
        }
    };

    private detectEnemyAttacking = (): void => {
        const wasAttacked = this.checkFighterAttacked({
            attacker: this.getEnemy(),
            defender: this.getPlayer(),
        });
        if (wasAttacked) {
            const damageTaken: number = 100 - this.getPlayer().getHealth();
            Object.assign(this.playerHealth.style, { width: `calc(100% - ${damageTaken}%)` });
        }
    };

    private detectWallCollision = (fighter: Fighter): void => {
        if (
            fighter.getPosition().x <= 0
            && fighter.getVelocity().x < 0
        ) {
            fighter.setVelocity({ x: 0, y: fighter.getVelocity().y });
        } else if (
            fighter.getPosition().x + fighter.width >= this.getCanvas().width
            && fighter.getVelocity().x > 0
        ) {
            fighter.setVelocity({ x: 0, y: fighter.getVelocity().y });
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
