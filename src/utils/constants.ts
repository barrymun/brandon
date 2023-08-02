import { KeyBindings } from "utils";

export const playerKeyBindings: KeyBindings = {
    left: 'a',
    right: 'd',
    jump: 'w',
};

export const enemyKeyBindings: KeyBindings = {
    left: 'ArrowLeft',
    right: 'ArrowRight',
    jump: 'ArrowUp',
};

export enum Colour {
    Red = 'red',
    Green = 'green',
    Blue = 'blue',
};
