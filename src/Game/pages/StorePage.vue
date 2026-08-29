<template>
  <div class="page store-page">
    <div class="store-header">
      <div class="header-top">
        <button class="back-btn" @click="goBack">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <h1>BOUTIQUE</h1>
        <div class="spacer"></div>
      </div>
      <div class="header-bottom">
        <div class="coins-badge">
          <img src="/images/Game/Store/oneCoin.png" alt="Coin" />
          <span>{{ userCoins }}</span>
        </div>
      </div>
    </div>

    <div class="store-content">
      <div class="category">
        <div class="category-header">
          <img src="/images/Game/Store/iconStoreInventory.png" alt="Inventory" />
          <h2>OBJETS</h2>
        </div>
        <div class="store-grid">
          <StoreCard
            v-for="item in inventoryStoreDetails"
            :key="item.title"
            :title="item.title"
            :icon="item.iconImage"
            :price="item.price"
            currencyImage="/images/Game/Store/oneCoin.png"
            theme="inventory"
            @click="buyItem(item)" />
        </div>
      </div>

      <div class="category">
        <div class="category-header">
          <img src="/images/Game/Store/iconStoreCoin.png" alt="Coins" />
          <h2>PIÈCES</h2>
        </div>
        <div class="store-grid">
          <StoreCard
            v-for="coin in coinStoreDetails"
            :key="coin.title"
            :title="`${coin.value} PIÈCES`"
            :icon="coin.iconImage"
            :price="coin.price"
            currencyText="€"
            theme="coin"
            @click="buyCoin(coin)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '../store/game.store.ts';
import StoreCard from '../components/store/StoreCard.vue';
import { ScoreFacadeService } from '../services/score-facade.service.ts';
import { useCommonToasts } from '../../shared/services/utils.ts';
import { ITEMS_INVENTORY } from '../models/game.types.ts';
import type { InventoryItem, ItemStore } from '../models/store.types.ts';

const router = useRouter();
const gameStore = useGameStore();
const scoreFacadeService = new ScoreFacadeService();
const { showToastError } = useCommonToasts();

const userCoins = computed(() => {
  const game = gameStore.getGame();
  return game?.statsGame?.coins || 0;
});

const inventoryStoreDetails = ITEMS_INVENTORY;

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

function goBack(): void {
  router.go(-1);
}

async function buyItem(item: InventoryItem): Promise<void> {
  try {
    await scoreFacadeService.buyItemInventory(item);
  } catch (error) {
    console.error(error);
    showToastError();
  }
}

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
.store-page {
  width: 100%;
  height: 100vh;
  background-color: #ff7e23;
  background-image:
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'><g transform='translate(10, 10) rotate(-15, 60, 60)'><path d='M60 35 Q75 35 80 55 L40 55 Q45 35 60 35 Z' fill='rgba(255,255,255,0.15)'/><ellipse cx='60' cy='60' rx='40' ry='15' fill='rgba(255,255,255,0.2)'/><circle cx='40' cy='60' r='3' fill='rgba(255,255,255,0.3)'/><circle cx='60' cy='60' r='3' fill='rgba(255,255,255,0.3)'/><circle cx='80' cy='60' r='3' fill='rgba(255,255,255,0.3)'/></g></svg>"),
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'><g transform='translate(10, 10) rotate(-15, 60, 60)'><path d='M60 35 Q75 35 80 55 L40 55 Q45 35 60 35 Z' fill='rgba(255,255,255,0.15)'/><ellipse cx='60' cy='60' rx='40' ry='15' fill='rgba(255,255,255,0.2)'/><circle cx='40' cy='60' r='3' fill='rgba(255,255,255,0.3)'/><circle cx='60' cy='60' r='3' fill='rgba(255,255,255,0.3)'/><circle cx='80' cy='60' r='3' fill='rgba(255,255,255,0.3)'/></g></svg>"),
    linear-gradient(135deg, #ff8c00 0%, #ff5722 100%);
  background-position:
    0 0,
    70px 70px,
    0 0;
  background-size:
    140px 140px,
    140px 140px,
    auto;
  background-blend-mode: overlay;
  display: flex;
  flex-direction: column;
  color: #333;
  font-family: 'Montserrat', sans-serif;
}

.store-header {
  display: flex;
  flex-direction: column;
  width: 100%;

  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 15px;
    padding: 15px 20px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    border-bottom: 2px solid rgba(255, 255, 255, 0.5);

    .spacer {
      width: 45px; /* Same width as back-btn to balance the title */
    }

    .back-btn {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background: #fff;
      border: 2px solid #e65100;
      color: #e65100;
      font-size: 1.2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(230, 81, 0, 0.3);
      transition: transform 0.2s;

      &:active {
        transform: scale(0.9);
      }
    }

    h1 {
      font-size: 1.8rem;
      font-weight: 900;
      margin: 0;
      color: #fff;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      letter-spacing: 2px;
    }
  }

  .header-bottom {
    display: flex;
    justify-content: flex-end;
    padding: 10px 20px 0px;

    .coins-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.95);
      padding: 5px 15px 5px 5px;
      border-radius: 30px;
      border: 2px solid #ffd700;
      box-shadow:
        0 4px 10px rgba(0, 0, 0, 0.2),
        inset 0 0 5px rgba(255, 215, 0, 0.5);

      span {
        font-size: 1.3rem;
        font-weight: 900;
        color: #ff8f00;
      }

      img {
        width: 35px;
        height: 35px;
        object-fit: contain;
        filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
      }
    }
  }
}

.store-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15px;
  gap: 25px;
  overflow-y: auto;
}

.category {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(255, 255, 255, 0.25);
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  padding: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  .category-header {
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 2px dashed rgba(255, 255, 255, 0.6);
    padding-bottom: 10px;
    margin-bottom: 5px;

    img {
      width: 35px;
      height: 35px;
      object-fit: contain;
      filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2));
    }

    h2 {
      margin: 0;
      font-size: 1.4rem;
      font-weight: 800;
      color: #fff;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      letter-spacing: 1px;
    }
  }

  .store-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    padding: 5px;
  }
}
</style>
