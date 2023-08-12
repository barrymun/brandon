import { KeyBindings } from "utils";

export const defaultCanvasWidth: number = 1024;
export const defaultCanvasHeight: number = 576;
export const playerKeyBindings: KeyBindings = {
    left: 'a',
    right: 'd',
    jump: 'w',
    attack: ' ',
};
export const enemyKeyBindings: KeyBindings = {
    left: 'ArrowLeft',
    right: 'ArrowRight',
    jump: 'ArrowUp',
    attack: 'Enter',
};
export enum Colour {
    Red = 'red',
    Green = 'green',
    Blue = 'blue',
    Black = 'black',
    Overlay = 'rgba(255, 255, 255, 0.15)',
};
export enum Direction {
    Left = 'left',
    Right = 'right',
}
export const defaultTimer: number = 31; // seconds
export const defaultHealth: number = 100;
export const defaultAttackDamage: number = 20;
export const groundOffset: number = 96;
