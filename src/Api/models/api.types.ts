import type { BubbleTypeEnum } from '../../Game/models/BubbleTypeEnum.ts';
import type { BubbleColorEnum } from '../../Game/models/BubbleColorEnum.ts';
import type { BubbleStatusEnum } from '../../Game/models/BubbleStatusEnum.ts';
import type { User } from '../../shared/models/user.types.ts';

export type DatabaseSchema = {
  user: User;
  game: GameApi;
  bubble: BubbleApi;
  playerStats: PlayerStatsApi;
};

export type GameApi = {
  id: string;
  userId: string;
  score: number;
  oxygenLevel: number;
  inventory: string[];
};

export type BubbleApi = {
  id: string;
  gameId: string;
  type: BubbleTypeEnum;
  color: BubbleColorEnum | null;
  isPivot: boolean;
  rowIndex: number | null;
  columnIndex: number | null;
  status: BubbleStatusEnum;
};

export type PlayerStatsApi = {
  id: string;
  userId: string;
  bestScore: number;
  coins: number;
};
