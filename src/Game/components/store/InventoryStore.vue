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
import { InventoryItemEnum } from '../../models/InventoryItemEnum.ts';

const scoreFacadeService = new ScoreFacadeService();
const { showToastError } = useCommonToasts();

const inventoryStoreDetails = [
  {
    title: '1 bombe',
    inventory: InventoryItemEnum.BOMB,
    iconImage: '/images/Game/Items/bomb.png',
    price: 5,
    value: 1,
  },
  {
    title: '1 oxygène',
    inventory: InventoryItemEnum.OXYGEN,
    iconImage: '/images/Game/Items/oxygen.png',
    price: 10,
    value: 1,
  },
];

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
