<template>
  <Dialog :modal="true" :closable="false" @update:visible="emit('close')" dismissableMask :visible="activeChangeAstronaut" :style="{ width: '80%' }">
    <div class="change-avatar">
      <h2>{{ t('settings.chooseAstronaut') }}</h2>
      <div class="avatar-img">
        <img
          v-for="(astronaut, index) in availableAstronauts"
          :key="index"
          :src="astronaut.url"
          alt="Avatar"
          @click="
            emit('change', astronaut);
            emit('close');
          " />
      </div>
    </div>
  </Dialog>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Dialog } from 'primevue';
import type { Image } from '../../../shared/models/user.types.ts';
import { astronauts } from '../../../../public/assets/astronauts.ts';

defineProps({
  activeChangeAstronaut: Boolean,
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'change', chosenAstronaut: Image): void;
}>();

const { t } = useI18n();
const availableAstronauts = ref<Image[]>([]);

onMounted(async () => {
  availableAstronauts.value = astronauts;
});
</script>

<style scoped lang="scss">
.change-avatar {
  text-align: center;
  color: var(--secondary-color);

  h2 {
    padding-bottom: 5%;
  }

  .avatar-img {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    img {
      width: 80px;
      object-fit: contain;
      cursor: pointer;
    }
  }
}
</style>
