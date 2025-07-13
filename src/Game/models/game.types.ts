import type { BubbleColorEnum } from './BubbleColorEnum.ts';
import type { BubbleTypeEnum } from './BubbleTypeEnum.ts';
import type { BubbleStatusEnum } from './BubbleStatusEnum.ts';
import { BubbleSatelliteOrientationEnum } from './BubbleSatelliteOrientationEnum.ts';
import { InventoryItemEnum } from './InventoryItemEnum.ts';

export const ROWS_GRID_GAME = 15;
export const ROWS_VISIBLE_GRID_GAME: number = 10;
export const COLS_GRID_GAME: number = 6;
export const MIN_MATCHING_BUBBLE: number = 4;
export const GAIN_OXYGEN: number = 20;
export const POINTS_PER_BUBBLE: number = 10;
export const MAX_OXYGEN: number = 100;
export const MAX_INVENTORY_SIZE: number = 2;
export const CHANCE_TO_GENERATE_SPECIAL_BUBBLES: number = 0.2; // = 20 %
export const CELL_SIZE = 40;
export const FALL_SPEED_PX_PER_MS = 0.2; // plus c'est petit grand plus c'est rapide

export const ITEMS_INVENTORY: ItemInventory[] = [
  {
    title: '1 bombe',
    inventory: InventoryItemEnum.BOMB,
    iconImage: '/images/Game/Items/bomb.png',
    price: 5,
    value: 1,
  },
  {
    title: '1 oxygène',
    inventory: InventoryItemEnum.OXYGEN,
    iconImage: '/images/Game/Items/oxygen.png',
    price: 10,
    value: 1,
  },
];

export const FALLING_BUBBLES_DELAY_MS = 2000;

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

export type ItemInventory = {
  title: string;
  inventory: InventoryItemEnum;
  iconImage: string;
  price: number;
  value: number;
};
