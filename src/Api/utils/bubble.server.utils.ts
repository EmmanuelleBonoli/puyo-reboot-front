import { BubbleColorEnum } from '../../Game/models/BubbleColorEnum.ts';
import { BubbleTypeEnum } from '../../Game/models/BubbleTypeEnum.ts';
import { RulesGame } from './rulesGame.ts';

export function getRandomColor(): BubbleColorEnum {
  const colors: BubbleColorEnum[] = [BubbleColorEnum.BLUE, BubbleColorEnum.GREEN, BubbleColorEnum.RED, BubbleColorEnum.YELLOW];
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
}

export function pickRandomSpecialType(): BubbleTypeEnum {
  const roll = Math.random();
  if (roll < RulesGame.CHANCE_PICK_GHOST) {
    return BubbleTypeEnum.GHOST;
  }
  if (roll < RulesGame.CHANCE_PICK_UNBREAKABLE) {
    return BubbleTypeEnum.UNBREAKABLE;
  }
  return BubbleTypeEnum.GIFT;
}
