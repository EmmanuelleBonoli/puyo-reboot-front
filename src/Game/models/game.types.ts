import type {BubbleColorEnum} from "./BubbleColorEnum.ts";
import type {BubbleTypeEnum} from "./BubbleTypeEnum.ts";
import type {BubbleStatusEnum} from "./BubbleStatusEnum.ts";
import {BubbleSatelliteOrientationEnum} from "./BubbleSatelliteOrientationEnum.ts";

export const ROWS_GRID_GAME: number = 10;
export const COLS_GRID_GAME: number = 6;
export const MIN_MATCHING_BUBBLE: number = 3;

export const GRAVITY_ANIMATION_DELAY_MS = 250;

export type GridGame = (Bubble | null)[][];

export const SATELLITE_OFFSETS: Record<BubbleSatelliteOrientationEnum, [number, number]> = {
    [BubbleSatelliteOrientationEnum.UP]: [-1, +1],
    [BubbleSatelliteOrientationEnum.RIGHT]: [-1, -1],
    [BubbleSatelliteOrientationEnum.DOWN]: [+1, -1],
    [BubbleSatelliteOrientationEnum.LEFT]: [+1, +1],
};

export const NEXT_ORIENTATION_MAP: Record<BubbleSatelliteOrientationEnum, BubbleSatelliteOrientationEnum> = {
    [BubbleSatelliteOrientationEnum.UP]: BubbleSatelliteOrientationEnum.RIGHT,
    [BubbleSatelliteOrientationEnum.RIGHT]: BubbleSatelliteOrientationEnum.DOWN,
    [BubbleSatelliteOrientationEnum.DOWN]: BubbleSatelliteOrientationEnum.LEFT,
    [BubbleSatelliteOrientationEnum.LEFT]: BubbleSatelliteOrientationEnum.UP,
};

export const DIRECTIONS_GAME: number[][] = [
    [0, 1],   // droite
    [1, 0],   // bas
    [0, -1],  // gauche
    [-1, 0]   // haut
];

export type Game = {
    id: string;
    statsGame: StatsGame;
    restingBubbles: Bubble[];
    waitingBubbles: BubblePair;
    fallingBubbles: BubblePair;
};

export type StatsGame = {
    durationGame: number;
    explodedBubbles: number;
};

export type Bubble = {
    id: string;
    position: BubblePosition;
    color: BubbleColorEnum;
    type: BubbleTypeEnum;
    status: BubbleStatusEnum;
};

export type BubblePosition = {
    rowIndex: number;
    columnIndex: number;
}

export type BubblePairState = BubbleStatusEnum.WAITING | BubbleStatusEnum.FALLING;

export type BubblePair = {
    pivot: Bubble;
    satellite: Bubble;
    orientation: BubbleSatelliteOrientationEnum;
    status: BubblePairState;
}

export type FallStyle = {
    transform: string;
    animation: string;
}

