import type { Bubble, BubblePair } from '../../Game/models/game.types.ts';
import { BubbleStatusEnum } from '../../Game/models/BubbleStatusEnum.ts';
import { getRandomColor, pickRandomSpecialType } from '../utils/bubble.server.utils.ts';
import { BubbleTypeEnum } from '../../Game/models/BubbleTypeEnum.ts';
import type { BubbleApi } from '../models/api.types.ts';
import { BubbleSatelliteOrientationEnum } from '../../Game/models/BubbleSatelliteOrientationEnum.ts';
import { bubbleRepository } from '../repositories/bubble.repository.ts';
import { RulesGame } from '../utils/rulesGame.ts';
import { generateUUID } from '../../shared/utils/shared.utils.ts';

class BubbleServerService {
  fromServerToClient(bubblesApi: BubbleApi[]): Bubble[] {
    // Filter out any undefined/null entries coming from repository
    const validBubbles = (bubblesApi || []).filter(Boolean) as BubbleApi[];

    return validBubbles.map(b => ({
      id: b.id,
      type: b.type,
      color: b.color,
      status: b.status,
      position: {
        rowIndex: b.rowIndex ?? 0,
        columnIndex: b.columnIndex ?? 0,
      },
    }));
  }

  convertBubblesApiToBubblePair(bubbles: Bubble[]): BubblePair | null {
    const valid = (bubbles || []).filter(Boolean);
    if (valid.length < 2) {
      return null;
    }
    return {
      pivot: valid[0],
      satellite: valid[1],
      orientation: BubbleSatelliteOrientationEnum.UP,
      status: valid[0].status,
    };
  }

  async createWaitingBubbles(gameId: string, count = 2): Promise<Bubble[]> {
    const bubbles: BubbleApi[] = [];

    for (let i = 0; i < count; i++) {
      const isPivot = i === 0;
      const bubble: BubbleApi = {
        id: generateUUID(),
        gameId: gameId,
        type: BubbleTypeEnum.NORMAL,
        color: getRandomColor(),
        status: BubbleStatusEnum.WAITING,
        isPivot,
        rowIndex: null,
        columnIndex: null,
      };
      bubbles.push(bubble);
    }

    await bubbleRepository.saveBubbles(bubbles);
    return this.fromServerToClient(bubbles);
  }

  async promoteWaitingToFalling(): Promise<Bubble[]> {
    const bubblesUpdated = await bubbleRepository.promoteWaitingToFalling();
    return this.fromServerToClient(bubblesUpdated);
  }

  async createWaitingSpecialBubbles(gameId: string): Promise<Bubble[]> {
    const maxSpecialBubbles = RulesGame.MAX_SPECIAL_BUBBLES;
    const numberOfSpecialBubbles = Math.floor(Math.random() * maxSpecialBubbles) + 1;

    const specialBubbles: BubbleApi[] = [];

    for (let i = 0; i < numberOfSpecialBubbles; i++) {
      const type = pickRandomSpecialType();
      const color = type === BubbleTypeEnum.GIFT ? getRandomColor() : null;

      const bubble: BubbleApi = {
        id: generateUUID(),
        gameId,
        type,
        color,
        status: BubbleStatusEnum.RESTING,
        isPivot: false,
        rowIndex: null,
        columnIndex: null,
      };

      specialBubbles.push(bubble);
    }

    await bubbleRepository.saveBubbles(specialBubbles);

    return this.fromServerToClient(specialBubbles);
  }
}

export const bubbleServerService = new BubbleServerService();
