export class Game {
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
    
    constructor() {
        this.setCanvas(document.getElementById('c')! as HTMLCanvasElement);
        this.setContext(this.canvas.getContext('2d')!);
        this.setCanvasSize();
        this.bindListeners();
        console.log('Config loaded');
    };

    private setCanvasSize = (): void => {
        this.getCanvas().width = window.innerWidth;
        this.getCanvas().height = window.innerHeight;

        this.getContext().fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    private domContentLoadedListener = (_event: Event) => {
        console.log('DOM fully loaded and parsed');
    };

    private unloadListener = (_event: Event) => {
        this.unbindListeners();
    };

    private bindListeners = (): void => {
        window.addEventListener('DOMContentLoaded', this.domContentLoadedListener);
        window.addEventListener('unload', this.unloadListener);
    };

    private unbindListeners = (): void => {
        window.removeEventListener('DOMContentLoaded', this.domContentLoadedListener);
        window.removeEventListener('unload', this.unloadListener);
        console.log('Unloaded');
    };
};
