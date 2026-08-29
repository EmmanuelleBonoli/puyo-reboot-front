import type { BubbleTypeEnum } from '../../Game/models/BubbleTypeEnum.ts';
import type { BubbleColorEnum } from '../../Game/models/BubbleColorEnum.ts';
import type { BubbleStatusEnum } from '../../Game/models/BubbleStatusEnum.ts';
import type { User } from '../../shared/models/user.types.ts';

export type AppStorageData = {
  user: User;
  game: GameApi;
  bubbles: BubbleApi[];
  playerStats: PlayerStatsApi;
};

export type GameApi = {
  isSeeded: boolean;
  score: number;
  oxygenLevel: number;
  inventory: string[];
};

export type BubbleApi = {
  id: string;
  type: BubbleTypeEnum;
  color: BubbleColorEnum | null;
  isPivot: boolean;
  rowIndex: number | null;
  columnIndex: number | null;
  status: BubbleStatusEnum;
};

export type PlayerStatsApi = {
  bestScore: number;
  coins: number;
};
