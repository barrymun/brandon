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

export enum Direction {
    Left = 'left',
    Right = 'right',
}

export const defaultTimer: number = 10; // seconds

export const defaultHealth: number = 100;

export const defaultAttackDamage: number = 10;;
