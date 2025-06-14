import {
  type Bubble,
  type BubblePosition,
  COLS_GRID_GAME,
  DIRECTIONS_GAME,
  type GridGame,
  MIN_MATCHING_BUBBLE,
  NEXT_ORIENTATION_MAP,
  ROWS_GRID_GAME,
  SATELLITE_OFFSETS,
} from '../models/game.types.ts';
import { BubbleTypeEnum } from '../models/BubbleTypeEnum.ts';
import { BubbleSatelliteOrientationEnum } from '../models/BubbleSatelliteOrientationEnum.ts';

export function getCellKey(row: number, col: number): string {
  return `${row},${col}`;
}

export function placeBubblesOnGridGame(bubbles: Bubble[], grid: GridGame): void {
  for (const bubble of bubbles) {
    const { rowIndex, columnIndex } = bubble.position;
    if (rowIndex >= 0 && rowIndex < ROWS_GRID_GAME && columnIndex >= 0 && columnIndex < COLS_GRID_GAME) {
      grid[rowIndex][columnIndex] = bubble;
    }
  }
}

export function getBubbleImage(bubble: Bubble): string {
  if (bubble.type === BubbleTypeEnum.GHOST || bubble.type === BubbleTypeEnum.UNBREAKABLE) {
    return `/images/Game/Bubbles/${bubble.type.toLowerCase()}.png`;
  }
  return `/images/Game/Bubbles/${bubble.color.toLowerCase()}.png`;
}

export function getMatchingGroup(grid: GridGame): Bubble[] {
  const visited = new Set<string>();

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      const bubble = grid[row][col];
      const key = getCellKey(row, col);

      if (bubble && bubble.type === BubbleTypeEnum.NORMAL && !visited.has(key)) {
        const group = findMatchingGroup(grid, row, col, visited);

        if (group.length >= MIN_MATCHING_BUBBLE) {
          return group;
        }
      }
    }
  }

  return [];
}

export function getNextSatellitePosition(bubble: Bubble, orientation: BubbleSatelliteOrientationEnum): BubblePosition {
  const offset = SATELLITE_OFFSETS[orientation];
  if (!offset) throw new Error(`Invalid orientation: ${orientation}`);

  const [rowOffset, colOffset] = offset;
  return {
    rowIndex: bubble.position.rowIndex + rowOffset,
    columnIndex: bubble.position.columnIndex + colOffset,
  };
}

export function getNextOrientation(orientation: BubbleSatelliteOrientationEnum): BubbleSatelliteOrientationEnum {
  const next = NEXT_ORIENTATION_MAP[orientation];
  if (!next) throw new Error(`Invalid orientation: ${orientation}`);
  return next;
}

export function isInsideGrid(position: BubblePosition, grid: GridGame): boolean {
  return position.rowIndex >= 0 && position.rowIndex < grid.length && position.columnIndex >= 0 && position.columnIndex < grid[0].length;
}

export function isEmptyPosition(bubblePosition: BubblePosition, gridGame: GridGame): boolean {
  if (!isInsideGrid(bubblePosition, gridGame)) return false;
  return gridGame[bubblePosition.rowIndex][bubblePosition.columnIndex] === null;
}

export function groupBubblesByColumn(bubbles: Bubble[]): Record<number, Bubble[]> {
  return bubbles.reduce(
    (acc, bubble) => {
      const col = bubble.position.columnIndex;
      if (!acc[col]) acc[col] = [];
      acc[col].push(bubble);
      return acc;
    },
    {} as Record<number, Bubble[]>
  );
}

export function computeGravityMovements(bubblesByCol: Record<number, Bubble[]>): Bubble[] {
  const bubblesToMove: Bubble[] = [];

  for (const col in bubblesByCol) {
    const columnBubbles = bubblesByCol[col].sort((a, b) => a.position.rowIndex - b.position.rowIndex);

    let nextFreeRow = 0;
    for (const bubble of columnBubbles) {
      if (bubble.position.rowIndex !== nextFreeRow) {
        bubblesToMove.push({
          ...bubble,
          position: {
            ...bubble.position,
            rowIndex: nextFreeRow,
          },
        });
      }
      nextFreeRow++;
    }
  }

  return bubblesToMove;
}

export function computeGravityDistances(updated: Bubble[], original: Bubble[]): Record<string, number> {
  const distanceMap: Record<string, number> = {};

  for (const bubble of updated) {
    const originalBubble = original.find(b => b.id === bubble.id);
    if (originalBubble) {
      distanceMap[bubble.id] = bubble.position.rowIndex - originalBubble.position.rowIndex;
    }
  }
  return distanceMap;
}

function findMatchingGroup(grid: GridGame, startRow: number, startCol: number, visited: Set<string>): Bubble[] {
  const matchingGroup: Bubble[] = [];
  const targetBubble = grid[startRow][startCol];

  if (!targetBubble || targetBubble.type !== BubbleTypeEnum.NORMAL) return matchingGroup;

  const stack: [number, number][] = [[startRow, startCol]];
  const targetColor = targetBubble.color;

  while (stack.length > 0) {
    const [row, col] = stack.pop()!;
    const key = getCellKey(row, col);

    if (!isInsideGrid({ rowIndex: row, columnIndex: col }, grid) || visited.has(key)) continue;

    const bubble = grid[row][col];
    if (!bubble || bubble.color !== targetColor || bubble.type !== BubbleTypeEnum.NORMAL) continue;

    visited.add(key);
    matchingGroup.push(bubble);

    for (const [dRow, dCol] of DIRECTIONS_GAME) {
      stack.push([row + dRow, col + dCol]);
    }
  }

  return matchingGroup;
}
