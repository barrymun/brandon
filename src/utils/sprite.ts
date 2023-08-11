import { Direction } from "utils";

export interface Coords {
    x: number;
    y: number;
};

export interface AttackBox {
    position: Coords;
};

export interface AttackBoxOffset {
    width: number;
    height: number;
}

export type DirectionFaced = Direction.Left | Direction.Right;

export type SpriteAnimation = 'idle' | 'attack' | 'jump' | 'fall' | 'run';
