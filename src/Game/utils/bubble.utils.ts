import {
  type Bubble,
  type BubblePair,
  COLS_GRID_GAME,
  DIRECTIONS_AROUND_BUBBLE,
  DIRECTIONS_MOVEMENT_GAME,
  type GridCell,
  type GridGame,
  type GridPosition,
  MIN_MATCHING_BUBBLE,
  NEXT_ORIENTATION_MAP,
  SATELLITE_OFFSETS,
  ROWS_GRID_GAME,
} from '../models/game.types.ts';
import { BubbleTypeEnum } from '../models/BubbleTypeEnum.ts';
import { BubbleSatelliteOrientationEnum } from '../models/BubbleSatelliteOrientationEnum.ts';
import { OrientationMoveEnum } from '../models/OrientationMoveEnum.ts';
import { BubbleStatusEnum } from '../models/BubbleStatusEnum.ts';

export function getCellKey(row: number, col: number): string {
  return `${row},${col}`;
}

export function isBubble(cell: GridCell): cell is Bubble {
  return !!cell && 'status' in cell && 'color' in cell && 'type' in cell;
}

export function removeBubblesOnGridGame(bubbles: Bubble[], grid: GridGame): void {
  for (const bubble of bubbles) {
    if (isInsideGrid(bubble.position)) {
      const { rowIndex, columnIndex } = bubble.position;
      grid[rowIndex][columnIndex] = { rowIndex, columnIndex };
    }
  }
}

export function placeBubblesOnGridGame(bubbles: Bubble[], grid: GridGame): void {
  for (const bubble of bubbles) {
    if (isInsideGrid(bubble.position)) {
      const { rowIndex, columnIndex } = bubble.position;
      grid[rowIndex][columnIndex] = bubble;
    }
  }
}

export function getBubbleImage(bubble: Bubble): string {
  if (bubble.type === BubbleTypeEnum.GHOST || bubble.type === BubbleTypeEnum.UNBREAKABLE) {
    return `/images/Game/Bubbles/${bubble.type.toLowerCase()}.png`;
  }
  return `/images/Game/Bubbles/${bubble.color?.toLowerCase()}.png`;
}

export function getMatchingGroup(grid: GridGame): Bubble[] {
  const visited = new Set<string>();
  const allMatchingGroups: Bubble[] = [];

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      const bubble = grid[row][col];
      const key = getCellKey(row, col);

      if (
        isBubble(bubble) &&
        (bubble.type === BubbleTypeEnum.NORMAL || bubble.type === BubbleTypeEnum.GIFT) &&
        !visited.has(key) &&
        bubble.status === BubbleStatusEnum.RESTING
      ) {
        const localVisited = new Set<string>();
        const group = findMatchingGroup(grid, row, col, visited);

        for (const k of localVisited) visited.add(k);

        if (group.length >= MIN_MATCHING_BUBBLE) {
          allMatchingGroups.push(...group);
        }
      }
    }
  }
  return allMatchingGroups;
}

export function getNextSatellitePosition(bubble: Bubble, orientation: BubbleSatelliteOrientationEnum): GridPosition {
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

export function isInsideGrid(position: GridPosition): boolean {
  return position.rowIndex >= 0 && position.rowIndex < ROWS_GRID_GAME && position.columnIndex >= 0 && position.columnIndex < COLS_GRID_GAME;
}

export function isEmptyPosition(position: GridPosition, gridGame: GridGame): boolean {
  const cell = gridGame[position.rowIndex]?.[position.columnIndex];
  return !isBubble(cell);
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

    let targetRow = 0;

    for (const bubble of columnBubbles) {
      if (bubble.position.rowIndex !== targetRow) {
        bubblesToMove.push({
          ...bubble,
          position: {
            ...bubble.position,
            rowIndex: targetRow,
          },
        });
      }
      targetRow++;
    }
  }

  return bubblesToMove;
}

function findMatchingGroup(grid: GridGame, startRow: number, startCol: number, visited: Set<string>): Bubble[] {
  const group: Bubble[] = [];
  const bubbleOnGrid = grid[startRow][startCol];

  if (!isBubble(bubbleOnGrid) || (isBubble(bubbleOnGrid) && bubbleOnGrid.type !== BubbleTypeEnum.NORMAL && bubbleOnGrid.type !== BubbleTypeEnum.GIFT))
    return group;

  const targetColor = bubbleOnGrid.color;
  const stack: [number, number][] = [[startRow, startCol]];

  while (stack.length > 0) {
    const [row, col] = stack.pop()!;
    const key = `${row},${col}`;

    if (visited.has(key)) continue;

    if (!isInsideGrid({ rowIndex: row, columnIndex: col })) continue;

    const bubble = grid[row][col];
    if (
      !isBubble(bubble) ||
      (isBubble(bubble) &&
        (bubble.status !== BubbleStatusEnum.RESTING ||
          (bubble.type !== BubbleTypeEnum.NORMAL && bubble.type !== BubbleTypeEnum.GIFT) ||
          bubble.color !== targetColor))
    )
      continue;

    visited.add(key);
    group.push(bubble);

    for (const [dRow, dCol] of DIRECTIONS_MOVEMENT_GAME) {
      stack.push([row + dRow, col + dCol]);
    }
  }

  return group;
}

export function isFreeOfMovement(fallingBubbles: BubblePair, gridGame: GridGame, orientationMove: OrientationMoveEnum): boolean {
  if (!fallingBubbles) return true;

  const positions = [fallingBubbles.pivot.position, fallingBubbles.satellite.position];

  const nextPositions = positions.map(pos => ({
    rowIndex: orientationMove === OrientationMoveEnum.down ? pos.rowIndex - 1 : pos.rowIndex,
    columnIndex:
      orientationMove === OrientationMoveEnum.down
        ? pos.columnIndex
        : orientationMove === OrientationMoveEnum.left
          ? pos.columnIndex - 1
          : pos.columnIndex + 1,
  }));

  for (const pos of nextPositions) {
    if (!isInsideGrid(pos)) return false;
    if (!isEmptyPosition(pos, gridGame)) return false;
  }
  return true;
}

export function findBubblesAroundPosition(position: GridPosition, gridGame: GridGame): Bubble[] {
  const bubbles: Bubble[] = [];

  for (const [dRow, dCol] of DIRECTIONS_AROUND_BUBBLE) {
    const newRow = position.rowIndex + dRow;
    const newCol = position.columnIndex + dCol;

    if (isInsideGrid({ rowIndex: newRow, columnIndex: newCol })) {
      const cell = gridGame[newRow][newCol];
      if (isBubble(cell)) {
        bubbles.push(cell);
      }
    }
  }

  return bubbles;
}

// calcule le nombre de places dispo par colonne
export function computeAvailableSlots(restingBubbles: Bubble[], columnCount: number, maxRow: number): Record<number, number> {
  const occupiedHeights: Record<number, number> = {};

  restingBubbles.forEach(b => {
    const col = b.position.columnIndex;
    occupiedHeights[col] = Math.max(occupiedHeights[col] ?? -1, b.position.rowIndex);
  });

  const availableSlots: Record<number, number> = {};
  for (let col = 0; col < columnCount; col++) {
    const lastOccupied = occupiedHeights[col] ?? -1;
    availableSlots[col] = maxRow - lastOccupied;
  }
  return availableSlots;
}

// choisit une colonne parmi celles encore valides
export function pickValidColumn(availableSlots: Record<number, number>): number | null {
  const validColumns = Object.entries(availableSlots)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, slots]) => slots > 0)
    .map(([col]) => parseInt(col));

  if (validColumns.length === 0) return null;

  const index = Math.floor(Math.random() * validColumns.length);
  return validColumns[index];
}
