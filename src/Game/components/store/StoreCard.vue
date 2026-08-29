<template>
  <div class="store-card" :class="theme" @click="emit('click')">
    <div class="card-icon-wrapper">
      <img :src="icon" :alt="title" class="card-icon" />
    </div>
    <div class="card-info">
      <span class="card-title">{{ title }}</span>
      <div class="card-price">
        <span v-if="pricePrefix">{{ pricePrefix }}</span>
        <span>{{ price }}</span>
        <img v-if="currencyImage" :src="currencyImage" alt="currency" class="currency-icon" />
        <span v-else-if="currencyText" class="currency-text">{{ currencyText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  icon: string;
  price: string | number;
  pricePrefix?: string;
  currencyImage?: string;
  currencyText?: string;
  theme?: 'inventory' | 'coin';
}>();

const emit = defineEmits(['click']);
</script>

<style scoped lang="scss">
.store-card {
  border-radius: 16px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s,
    border-color 0.2s;

  /* Use only :active for mobile to prevent sticky hover state */
  &:active {
    transform: scale(0.95);
  }

  @media (hover: hover) {
    &:hover {
      transform: translateY(-5px);
    }
  }

  .card-icon-wrapper {
    width: 80px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    margin-bottom: 10px;

    .card-icon {
      max-width: 60px;
      max-height: 60px;
      object-fit: contain;
    }
  }

  .card-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;

    .card-title {
      font-size: 1.1rem;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .card-price {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 5px 12px;
      border-radius: 20px;

      span {
        font-size: 1.2rem;
        font-weight: 900;
      }

      .currency-icon {
        width: 20px;
        height: 20px;
      }
    }
  }

  /* Themes */
  &.inventory {
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(255, 240, 220, 0.8));
    border: 2px solid #ffcc80;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

    @media (hover: hover) {
      &:hover {
        box-shadow: 0 8px 20px rgba(255, 150, 0, 0.3);
        border-color: #ff9800;
      }
    }

    .card-icon-wrapper {
      background: radial-gradient(circle, rgba(255, 165, 0, 0.15) 0%, transparent 70%);
      .card-icon {
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
      }
    }

    .card-title {
      color: #e65100;
    }

    .card-price {
      background: rgba(255, 255, 255, 0.8);
      border: 2px solid #ffd700;
      box-shadow: inset 0 0 5px rgba(255, 215, 0, 0.3);
      span {
        color: #ff8f00;
      }
    }
  }

  &.coin {
    background: linear-gradient(145deg, rgba(255, 250, 240, 0.95), rgba(255, 230, 200, 0.9));
    border: 2px solid #ffb300;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

    @media (hover: hover) {
      &:hover {
        box-shadow: 0 8px 20px rgba(255, 165, 0, 0.4);
        border-color: #ff8f00;
      }
    }

    .card-icon-wrapper {
      background: radial-gradient(circle, rgba(255, 165, 0, 0.2) 0%, transparent 70%);
      .card-icon {
        filter: drop-shadow(0 2px 4px rgba(255, 165, 0, 0.3));
      }
    }

    .card-title {
      color: #e65100;
    }

    .card-price {
      background: rgba(255, 255, 255, 0.9);
      border: 2px solid #4caf50;
      box-shadow: inset 0 0 5px rgba(76, 175, 80, 0.2);
      span {
        color: #388e3c;
      }
    }
  }
}
</style>
