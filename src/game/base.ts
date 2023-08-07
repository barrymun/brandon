export abstract class Base {
    public readonly canvas = document.getElementById('c')! as HTMLCanvasElement;

    public readonly gameTimer = document.getElementById('game-timer')! as HTMLDivElement;
    
    public readonly playerHealth = document.getElementById('player-health')! as HTMLDivElement;
    
    public readonly enemyHealth = document.getElementById('enemy-health')! as HTMLDivElement;
    
    public readonly gameOverDialog = document.getElementById('game-over-dialog')! as HTMLDialogElement;
    
    public readonly gameOverTitle = document.getElementById('game-over-title')! as HTMLDivElement;
    
    public readonly gameOverBtn = document.getElementById('game-over-btn')! as HTMLButtonElement;
    
    private context: CanvasRenderingContext2D;
    
    public getContext = (): CanvasRenderingContext2D => this.context;

    protected setContext = (context: CanvasRenderingContext2D): void => {
        this.context = context;
    };

    constructor() {
        this.setContext(this.canvas.getContext('2d')!);
    };
};
