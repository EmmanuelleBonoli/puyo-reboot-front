<template>
  <div class="game-container" :class="authStore.user?.isLeftHanded ? 'left-handed' : 'right-handed'">
    <div class="grid-game">
      <div
        v-for="cell in gridGame.flat()"
        :key="isBubble(cell) ? `${cell.position.rowIndex}-${cell.position.columnIndex}` : `${cell.rowIndex}-${cell.columnIndex}`"
        :id="isBubble(cell) ? `${cell.position.rowIndex}-${cell.position.columnIndex}` : `${cell.rowIndex}-${cell.columnIndex}`"
        class="cell">
        <img v-if="isBubble(cell)" :src="getBubbleImage(cell)" alt="bubble" class="bubble-img" />
        <img
          v-if="isBubble(cell) && cell.type === BubbleTypeEnum.GIFT"
          class="bubble-img gift"
          :src="`/images/Game/Gifts/${cell.color.toLowerCase()}.png`"
          alt="bubble" />
      </div>
    </div>

    <div class="info-game">
      <div class="waiting-bubbles">
        <img v-if="waitingBubbles" :src="getBubbleImage(waitingBubbles.satellite)" alt="bubble" class="bubble-img" />
        <img v-if="waitingBubbles" :src="getBubbleImage(waitingBubbles.pivot)" alt="bubble" class="bubble-img" />
      </div>
      <GameDashBoard />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, watch, watchEffect } from 'vue';
import { useAuthStore } from '../../../Authentication/store/auth.store.ts';

import GameDashBoard from '../dashBoard/GameDashBoard.vue';
import { useGameStore } from '../../store/game.store.ts';
import { type Bubble, type BubblePair, type GridGame } from '../../models/game.types.ts';
import { getBubbleImage, getMatchingGroup, isBubble } from '../../utils/bubble.utils.ts';
import { GameFacadeService } from '../../services/game-facade.service.ts';
import { ScoreFacadeService } from '../../services/score-facade.service.ts';
import { BubbleTypeEnum } from '../../models/BubbleTypeEnum.ts';

const props = defineProps({
  isGamePlayOn: Boolean,
});

const authStore = useAuthStore();
const gameStore = useGameStore();
const gameFacadeService = new GameFacadeService();
const scoreFacadeService = new ScoreFacadeService();

const restingBubbles = computed<Bubble[]>(() => gameStore.getRestingBubbles());
const waitingBubbles = computed<BubblePair | null>(() => gameStore.getWaitingBubbles());
const fallingBubbles = computed<BubblePair | null>(() => gameStore.getFallingBubbles());

const gridGame = computed<GridGame>(() => {
  const bubblesOnGrid = fallingBubbles.value
    ? [...restingBubbles.value, fallingBubbles.value.satellite, fallingBubbles.value.pivot]
    : [...restingBubbles.value];
  return gameFacadeService.updateGridGame(bubblesOnGrid);
});

const matchBubbles = computed<Bubble[]>(() => {
  return getMatchingGroup(gridGame.value);
});

watch(
  () => props.isGamePlayOn,
  async isGamePlayOn => {
    if (isGamePlayOn) {
      await gameFacadeService.gameOn();
    } else {
      gameFacadeService.pauseGame();
    }
  },
  { immediate: true }
);

watchEffect(async () => {
  if (props.isGamePlayOn) {
    if (matchBubbles.value.length > 0) {
      await resolveMatchesBubbles();
    }
  }
});

async function resolveMatchesBubbles(): Promise<void> {
  while (true) {
    gameFacadeService.applyGravity();

    await new Promise(resolve => setTimeout(resolve, 600));
    const currentMatches = [...matchBubbles.value];
    if (currentMatches.length === 0) break;

    const giftBubbles = currentMatches.filter(bubble => bubble.type === BubbleTypeEnum.GIFT);
    if (giftBubbles.length > 0) {
      gameFacadeService.generatePlayerGift(giftBubbles.length);
    }

    const ghostBubblesToDelete = gameFacadeService.ghostBubbleAroundMatchingGroup(currentMatches);
    currentMatches.push(...ghostBubblesToDelete);

    gameFacadeService.deleteBubbles(currentMatches);

    updateScore(currentMatches.length);
    updateOxygen(currentMatches.length);

    await new Promise(resolve => setTimeout(resolve, 400));
  }
}

function updateScore(matchingBubblesNumber: number): void {
  //todo : add logic to multiply the score if there is combos chains
  scoreFacadeService.updateScore(matchingBubblesNumber, false);
}

function updateOxygen(matchingBubblesNumber: number): void {
  //todo : add logic to multiply the score if there is combos chains
  scoreFacadeService.updateOxygen(matchingBubblesNumber, false);
}
</script>

<style scoped>
.game-container {
  width: 100%;
  height: 75%;
  display: flex;
  justify-content: space-around;
  align-items: center;

  &.left-handed {
    flex-direction: row;
  }

  &.right-handed {
    flex-direction: row-reverse;
  }

  .grid-game {
    display: grid;
    grid-template-rows: repeat(10, 50px);
    grid-template-columns: repeat(6, 50px);
    transform: scaleY(-1);
  }

  .info-game {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 12%;

    .waiting-bubbles {
      display: grid;
      width: 100%;
      grid-template-rows: repeat(2, 50px);
      grid-template-columns: repeat(1, 50px);
      padding: 10%;
      border-radius: 10px;
      justify-content: center;
      align-items: center;
    }
  }

  .bubble-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .gift {
    position: absolute;
  }

  .cell {
    border: 1px solid var(--surface-card);
    display: flex;
    align-items: center;
    justify-content: center;
    transform: scaleY(-1);
    position: relative;
  }

  @keyframes fall {
    from {
      transform: translateY(0);
      opacity: 0.5;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .falling-animation {
    animation: fall 0.25s ease-out;
  }
}
</style>
