import type { BubbleApi } from '../models/api.types.ts';
import { BubbleStatusEnum } from '../../Game/models/BubbleStatusEnum.ts';
import type { Bubble } from '../../Game/models/game.types.ts';
import { storageService } from '../config/storage.service.ts';

class BubbleRepository {
  async saveBubbles(bubbles: BubbleApi[]): Promise<void> {
    try {
      await storageService.insert('bubble', bubbles);
    } catch (err) {
      throw err;
    }
  }

  async findAll(): Promise<BubbleApi[]> {
    return await storageService.getAllBubbles();
  }

  async promoteWaitingToFalling(): Promise<BubbleApi[]> {
    const bubblePivot = await storageService.updateBubblesWhere(
      {
        status: BubbleStatusEnum.WAITING,
        isPivot: true,
      },
      {
        status: BubbleStatusEnum.FALLING,
        rowIndex: 8,
        columnIndex: 3,
      }
    );

    const bubbleSatellite = await storageService.updateBubblesWhere(
      {
        status: BubbleStatusEnum.WAITING,
        isPivot: false,
      },
      {
        status: BubbleStatusEnum.FALLING,
        rowIndex: 9,
        columnIndex: 3,
      }
    );

    return [...(bubblePivot || []), ...(bubbleSatellite || [])].filter(Boolean);
  }

  async syncRestingBubblesWithFront(frontRestingBubbles: Bubble[]): Promise<void> {
    const existingBubbles: BubbleApi[] = await bubbleRepository.findAll();
    const restingBubblesDb = existingBubbles.filter(b => b.status === 'RESTING');

    const idsFromFront = new Set(frontRestingBubbles.map(b => b.id));
    const bubblesToDelete = restingBubblesDb.filter(b => !idsFromFront.has(b.id));

    if (bubblesToDelete.length > 0) {
      await bubbleRepository.deleteBubbles(bubblesToDelete);
    }

    for (const bubble of frontRestingBubbles) {
      await storageService.updateBubbleById(bubble.id, {
        rowIndex: bubble.position.rowIndex,
        columnIndex: bubble.position.columnIndex,
        status: bubble.status,
      });
    }
  }

  async deleteBubbles(bubbles: BubbleApi[]): Promise<void> {
    const idsToDelete = bubbles.map(b => b.id);
    if (idsToDelete.length === 0) return;

    await storageService.deleteBubbleById(idsToDelete);
  }
}

export const bubbleRepository = new BubbleRepository();
