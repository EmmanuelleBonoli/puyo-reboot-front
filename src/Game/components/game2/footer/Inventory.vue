<template>
  <div class="inventory">
    <img class="inventory-img" src="/images/refonte/inventory.png" alt="inventory" />
    <div class="items-container">
      <div v-for="(item, index) of inventory" :key="index" class="item">
        <img
          @touchstart="selectInventoryItem($event, item)"
          @touchmove="updateCursorPosition"
          @touchend="onTouchEnd"
          :src="`/images/Game/Items/${item.toLowerCase()}.png`"
          :alt="`item-${item}`"
          class="inventory-item" />
      </div>
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
import { ScoreFacadeService } from '../../../services/score-facade.service.ts';
import { computed, ref } from 'vue';
import { InventoryItemEnum } from '../../../models/InventoryItemEnum.ts';

const scoreService = new ScoreFacadeService();
const inventory = computed<InventoryItemEnum[]>(() => scoreService.getInventory());
const selectedItem = ref<InventoryItemEnum | null>(null);
const cursorX = ref(0);
const cursorY = ref(0);

async function selectInventoryItem(event: Event, itemSelected: InventoryItemEnum): Promise<void> {
  event.preventDefault();
  event.stopPropagation();

  if (!itemSelected) {
    return;
  }

  if (itemSelected === InventoryItemEnum.BOMB) {
    selectedItem.value = itemSelected;
  } else {
    await scoreService.useInventoryItem(itemSelected);
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
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.inventory-img {
  position: absolute;
  top: 0;
  left: 0;
  object-fit: contain;
  height: 100%;
  width: 100%;
  z-index: 1;
}

.items-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  z-index: 2;
  padding: 10%;
}

.item {
  width: 30%;
  height: 60%;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s ease-in-out;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
  }

  &:active {
    transform: scale(0.9);
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
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
}
</style>
