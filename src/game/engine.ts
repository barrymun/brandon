import { Base } from "game/base";
import { Fighter, FighterProps } from "game/fighter";
import { Sprite } from "game/sprite";
import { Colour, Direction, defaultTimer, enemyKeyBindings, playerKeyBindings } from "utils";

export class Engine extends Base {
    private animationRequestId: number;

    private getAnimationRequestId = (): number => this.animationRequestId;

    private setAnimationRequestId = (animationRequestId: number): void => {
        this.animationRequestId = animationRequestId;
    };

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

    private background: Sprite;

    public getBackground = (): Sprite => this.background;

    private setBackground = (background: Sprite): void => {
        this.background = background;
    };
    
    private shop: Sprite;

    public getShop = (): Sprite => this.shop;

    private setShop = (shop: Sprite): void => {
        this.shop = shop;
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
        super();
        this.setCanvasSize();

        const background: Sprite = new Sprite({
            position: { x: 0, y: 0 },
            imageSrc: 'assets/img/background.png',
        });
        this.setBackground(background);
        
        const shop: Sprite = new Sprite({
            position: { x: 600, y: 128 },
            imageSrc: 'assets/img/shop.png',
            scale: 2.75,
            totalFrames: 6, // from image
        });
        this.setShop(shop);
        
        const player: Fighter = this.createFighter({
            position: { x: 0, y: 0 },
            velocity: { x: 0, y: 0 },
            keyBindings: playerKeyBindings,
            directionFaced: Direction.Right,
            sprites: {
                idle: {
                    imageSrc: 'assets/img/samurai-mack/idle.png',
                    totalFrames: 8,
                },
                attack: {
                    imageSrc: 'assets/img/samurai-mack/attack-1.png',
                    totalFrames: 6,
                },
                jump: {
                    imageSrc: 'assets/img/samurai-mack/jump.png',
                    totalFrames: 2,
                },
                fall: {
                    imageSrc: 'assets/img/samurai-mack/fall.png',
                    totalFrames: 2,
                },
                run: {
                    imageSrc: 'assets/img/samurai-mack/run.png',
                    totalFrames: 8,
                },
            },
            scale: 2.5,
            offset: { x: 215, y: 157 },
        });
        this.setPlayer(player);
        
        const enemy: Fighter = this.createFighter({
            position: { x: 400, y: 100 },
            velocity: { x: 0, y: 0 },
            keyBindings: enemyKeyBindings,
            directionFaced: Direction.Left,
            sprites: {
                idle: {
                    imageSrc: 'assets/img/kenji/idle.png',
                    totalFrames: 4,
                },
                attack: {
                    imageSrc: 'assets/img/kenji/attack-1.png',
                    totalFrames: 4,
                },
                jump: {
                    imageSrc: 'assets/img/kenji/jump.png',
                    totalFrames: 2,
                },
                fall: {
                    imageSrc: 'assets/img/kenji/fall.png',
                    totalFrames: 2,
                },
                run: {
                    imageSrc: 'assets/img/kenji/run.png',
                    totalFrames: 8,
                },
            },
            scale: 2.5,
            offset: { x: 215, y: 172 },
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
        // const width: number = window.innerWidth;
        // const height: number = window.innerHeight;
        const width: number = 1024;
        const height: number = 576;
        
        this.canvas.width = width;
        this.canvas.height = height;

        this.getContext().fillRect(0, 0, width, height);
    }

    private createFighter = (props: FighterProps): Fighter => {
        const fighter = new Fighter(props);
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
            fighter.getPosition().x + fighter.width >= this.canvas.width
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
        if (this.getAnimationRequestId()) {
            cancelAnimationFrame(this.getAnimationRequestId());
        }
        
        if (this.getGameTimeout()) {
            clearTimeout(this.getGameTimeout());
        }
        
        this.getPlayer().destroy();
        this.getEnemy().destroy();

        // ensure closed before re-opening otherwise error will be thrown
        this.gameOverDialog.close();
        this.gameOverDialog.showModal();
    };

    public run = (): void => {
        const animationRequestId = requestAnimationFrame(this.run);
        this.setAnimationRequestId(animationRequestId);

        this.getContext().fillStyle = Colour.Black;
        this.getContext().fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.detectPlayerAttacking();
        this.detectEnemyAttacking();
        this.detectPlayerWallCollision();
        this.detectEnemyWallCollision();
        this.determineDirectionFaced();
        
        this.getBackground().update();
        this.getShop().update();
        this.getPlayer().update();
        this.getEnemy().update();

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
