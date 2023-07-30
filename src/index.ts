import { Config } from "src/game";

const canvas: HTMLCanvasElement = document.getElementById('c')! as HTMLCanvasElement;
const context: CanvasRenderingContext2D = canvas.getContext('2d')!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

context.fillRect(0, 0, canvas.width, canvas.height);

const config = new Config();

const domContentLoadedListener = (_event: Event) => {
    console.log('DOM fully loaded and parsed');
};

const unloadListener = (_event: Event) => {
    window.removeEventListener('DOMContentLoaded', domContentLoadedListener);
    window.removeEventListener('unload', unloadListener);
    console.log('Page unloaded');
};

window.addEventListener('DOMContentLoaded', domContentLoadedListener);
window.addEventListener('unload', unloadListener);
