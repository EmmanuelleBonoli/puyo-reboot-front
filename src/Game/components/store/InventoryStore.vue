<template>
  <div class="inventory-store">
    <Button v-for="item in inventoryStoreDetails" :key="item.title" class="item-store" @click="buyItem(item)">
      <img :src="item.iconImage" :alt="item.title" />
      <p>
        {{ item.price }}
        <Avatar image="/images/Game/Store/oneCoin.png" shape="circle" />
      </p>
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button, Avatar } from 'primevue';
import { ScoreFacadeService } from '../../services/score-facade.service.ts';
import { useCommonToasts } from '../../../shared/services/utils.ts';
import type { InventoryItem } from '../../models/store.types.ts';
import { ITEMS_INVENTORY } from '../../models/game.types.ts';

const scoreFacadeService = new ScoreFacadeService();
const { showToastError } = useCommonToasts();

const inventoryStoreDetails = ITEMS_INVENTORY;

async function buyItem(item: InventoryItem): Promise<void> {
  try {
    await scoreFacadeService.buyItemInventory(item);
  } catch (error) {
    console.error(error);
    showToastError();
  }
}
</script>

<style scoped lang="scss">
.inventory-store {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  min-height: 120px;

  .item-store {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 90px;
    height: 110px;
    border: 1px solid var(--surface-card);
    padding: 2%;
    border-radius: 10px;
    margin-top: 20px;
    cursor: pointer;

    img {
      object-fit: contain;
      height: 60px;
    }

    p {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
