<template>
  <Dialog :modal="true" :closable="false" @update:visible="emit('close')" dismissableMask :visible="activeChangeAvatar" :style="{ width: '80%' }">
    <div class="change-avatar">
      <h2>{{ t('settings.chooseAvatar') }}</h2>
      <div class="avatar-img">
        <img
          v-for="(avatar, index) in availableAvatars"
          :key="index"
          :src="baseApiUrl + avatar"
          alt="Avatar"
          @click="
            emit('change', avatar);
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
import { baseApiUrl } from '../../../shared/models/sharedVariables.ts';
import { UserFacadeService } from '../../services/user-facade.service.ts';

defineProps({
  activeChangeAvatar: Boolean,
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'change', avatarChoose: string): void;
}>();

const userService = new UserFacadeService();
const { t } = useI18n();
const availableAvatars = ref<string[]>([]);

onMounted(async () => {
  availableAvatars.value = await userService.getAvailableAvatars();
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
