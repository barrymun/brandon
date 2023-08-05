import { Direction } from "utils";

export interface Coords {
    x: number;
    y: number;
};

export interface AttackBox {
    position: Coords;
    width: number;
    height: number;
};

export type DirectionFaced = Direction.Left | Direction.Right;
