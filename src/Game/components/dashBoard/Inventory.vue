<template>
  <div class="inventory">
    <div v-for="(item, index) of inventory" :key="index" class="item">
      <img
        @touchstart="selectInventoryItem($event, item)"
        @touchmove="updateCursorPosition"
        @touchend="onTouchEnd"
        :src="`/images/Game/Items/${item.toLowerCase()}.png`"
        :alt="`item-${item}`"
        class="inventory-item" />
    </div>
    <img
      v-if="selectedItem"
      alt="selected inventory item"
      :src="`/images/Game/Items/${selectedItem.toLowerCase()}.png`"
      class="floating-item"
      :style="{ top: `${cursorY}px`, left: `${cursorX}px` }" />
  </div>
</template>

<script setup lang="ts">
import { ScoreFacadeService } from '../../services/score-facade.service.ts';
import { computed, ref } from 'vue';
import { InventoryItemEnum } from '../../models/InventoryItemEnum.ts';

const scoreService = new ScoreFacadeService();
const inventory = computed<InventoryItemEnum[]>(() => scoreService.getInventory());
const selectedItem = ref<InventoryItemEnum | null>(null);
const cursorX = ref(0);
const cursorY = ref(0);

function selectInventoryItem(event: Event, itemSelected: InventoryItemEnum): void {
  event.preventDefault();
  event.stopPropagation();

  if (!itemSelected) {
    return;
  }

  if (itemSelected === InventoryItemEnum.BOMB) {
    selectedItem.value = itemSelected;
  } else {
    scoreService.useInventoryItem(itemSelected);
  }
}

function deselectItem(): void {
  selectedItem.value = null;
}

function updateCursorPosition(event: TouchEvent): void {
  cursorX.value = event.changedTouches[0].clientX;
  cursorY.value = event.changedTouches[0].clientY;
}

function onTouchEnd(event: TouchEvent): void {
  if (!selectedItem.value) {
    return;
  }

  const touch = event.changedTouches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);

  let position;
  if (target?.classList.contains('bubble-img')) {
    position = target.parentElement?.id;
  } else if (target?.classList.contains('cell')) {
    position = target.id;
  }

  if (position) {
    const [rowIndex, columnIndex] = position.split('-').map(Number);
    scoreService.useInventoryItem(selectedItem.value, { rowIndex, columnIndex });
  }

  if (selectedItem.value === InventoryItemEnum.BOMB) {
    deselectItem();
  }
}
</script>

<style scoped lang="scss">
.inventory {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 30%;
  background-color: var(--surface-card);
  border-radius: 10px;

  .item {
    width: 100%;
    height: 40%;
    border-radius: 50%;
    border: 1px solid var(--surface-card);

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    :hover {
      transform: scale(1.5);
      transition: transform 0.3s ease-in-out;
      cursor: grab;
    }

    :active {
      cursor: grabbing;
    }
  }

  .floating-item {
    position: fixed;
    width: 50px;
    height: 50px;
    pointer-events: none;
    transform: translate(-50%, -50%);
    z-index: 9999;
    opacity: 1;
    cursor: grabbing;
    //border: 2px solid red;
  }
}
</style>
