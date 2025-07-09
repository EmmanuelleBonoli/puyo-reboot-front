<template>
  <div class="coin-store">
    <Button v-for="coin in coinStoreDetails" :key="coin.title" class="item-store" @click="buyCoin(coin)">
      <img :src="coin.iconImage" :alt="coin.title" />
      <p>{{ coin.value }} pièces</p>
      <p>{{ coin.price }} €</p>
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from 'primevue';
import type { ItemStore } from '../../models/store.types.ts';
import { ScoreFacadeService } from '../../services/score-facade.service.ts';
import { useCommonToasts } from '../../../shared/services/utils.ts';

const scoreFacadeService = new ScoreFacadeService();
const { showToastError } = useCommonToasts();

const coinStoreDetails = [
  {
    title: '5 pièces',
    iconImage: '/images/Game/Store/oneCoin.png',
    price: 1.99,
    value: 5,
  },
  {
    title: '15 pièces',
    iconImage: '/images/Game/Store/threeCoins.png',
    price: 5,
    value: 15,
  },
  {
    title: '50 pièces',
    iconImage: '/images/Game/Store/manyCoins.png',
    price: 9.99,
    value: 50,
  },
];

async function buyCoin(coin: ItemStore): Promise<void> {
  try {
    await scoreFacadeService.buyCoin(coin);
  } catch (error) {
    console.error(error);
    showToastError();
  }
}
</script>

<style scoped lang="scss">
.coin-store {
  display: flex;
  justify-content: space-around;
  background: url('/images/Game/Store/backgroundCoins.png') no-repeat center;
  background-size: cover;
  min-height: 180px;
  overflow-x: scroll;

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
      height: 40px;
    }
  }
}
</style>
