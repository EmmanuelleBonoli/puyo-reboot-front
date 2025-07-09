import type { BubbleColorEnum } from './BubbleColorEnum.ts';
import type { BubbleTypeEnum } from './BubbleTypeEnum.ts';
import type { BubbleStatusEnum } from './BubbleStatusEnum.ts';
import { BubbleSatelliteOrientationEnum } from './BubbleSatelliteOrientationEnum.ts';
import type { InventoryItemEnum } from './InventoryItemEnum.ts';

export const ROWS_GRID_GAME: number = 10;
export const COLS_GRID_GAME: number = 6;
export const MIN_MATCHING_BUBBLE: number = 4;
export const GAIN_OXYGEN: number = 20;
export const POINTS_PER_BUBBLE: number = 10;
export const TIME_BETWEEN_MATCHING_BUBBLES_MS: number = 1500;
export const MAX_OXYGEN: number = 100;
export const MAX_INVENTORY_SIZE: number = 2;

export const FALLING_BUBBLES_DELAY_MS = 2000;
export const GRAVITY_ANIMATION_DELAY_MS = 250;

export type GridGame = GridCell[][];
export type GridCell = Bubble | GridPosition;

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

export const OPPOSITE_ORIENTATION_MAP: Record<BubbleSatelliteOrientationEnum, BubbleSatelliteOrientationEnum> = {
  [BubbleSatelliteOrientationEnum.UP]: BubbleSatelliteOrientationEnum.DOWN,
  [BubbleSatelliteOrientationEnum.RIGHT]: BubbleSatelliteOrientationEnum.LEFT,
  [BubbleSatelliteOrientationEnum.DOWN]: BubbleSatelliteOrientationEnum.UP,
  [BubbleSatelliteOrientationEnum.LEFT]: BubbleSatelliteOrientationEnum.RIGHT,
};

export const DIRECTIONS_MOVEMENT_GAME: number[][] = [
  [0, 1], // droite
  [1, 0], // bas
  [0, -1], // gauche
  [-1, 0], // haut
];

export const DIRECTIONS_AROUND_BUBBLE: number[][] = [
  [0, 0], // position actuelle
  [-1, 0], // haut
  [1, 0], // bas
  [0, -1], // gauche
  [0, 1], // droite
  [-1, -1], // haut-gauche
  [-1, 1], // haut-droit
  [1, -1], // bas-gauche
  [1, 1], // bas-droit
];

export const INITIAL_GAME: Game = {
  id: '',
  statsGame: {
    score: 0,
    oxygen: 100,
    inventory: [],
    bestScore: 0,
    coins: 0,
  },
  restingBubbles: [],
  waitingBubbles: null,
  fallingBubbles: null,
};

export type Game = {
  id: string;
  statsGame: StatsGame;
  restingBubbles: Bubble[];
  waitingBubbles: BubblePair | null;
  fallingBubbles: BubblePair | null;
};

export type StatsGame = {
  score: number;
  oxygen: number;
  inventory: InventoryItemEnum[];
  bestScore: number;
  coins: number;
};

export type GameData = {
  restingBubbles: Bubble[];
  statsGame: StatsGame;
};

export type Bubble = {
  id: string;
  position: GridPosition;
  color: BubbleColorEnum;
  type: BubbleTypeEnum;
  status: BubbleStatusEnum;
};

export type GridPosition = {
  rowIndex: number;
  columnIndex: number;
};

export type BubblePairState = BubbleStatusEnum.WAITING | BubbleStatusEnum.FALLING;

export type BubblePair = {
  pivot: Bubble;
  satellite: Bubble;
  orientation: BubbleSatelliteOrientationEnum;
  status: BubblePairState;
};

export type FallStyle = {
  transform: string;
  animation: string;
};
