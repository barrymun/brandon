import { KeyBindings } from "utils";

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
};
